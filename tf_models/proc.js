
// godzzo@godzzow1:~/Current/swedishSignsSummer/images$ cat labels1.csv > labels.csv 
// godzzo@godzzow1:~/Current/swedishSignsSummer/images$ cat labels2.csv >> labels.csv 

/*
30_SIGN: 9
50_SIGN: 193
70_SIGN: 215
80_SIGN: 193
100_SIGN: 108
GIVE_WAY: 121
NO_PARKING: 158
NO_STOPPING_NO_STANDING: 60
OTHER: 273
PASS_EITHER_SIDE: 15
PASS_RIGHT_SIDE: 500
PEDESTRIAN_CROSSING: 928
PRIORITY_ROAD: 652
STOP: 57

cat train_labels.csv | grep -v filename | sed s/jpg. /jpg/gi | while read a; do cp ./full/$a ./train/$a; done
cat train_labels.csv | grep -v filename | sed s/jpg. /jpg/gi | while read a; do ls -la ./train/$a; done
cat train_labels.csv | grep -v filename | sed s/jpg. /jpg/gi | sort | uniq | wc -l
* 
cat test_labels.csv | grep -v filename | sed s/jpg. /jpg/gi | while read a; do cp ./full/$a ./test/$a; done

godzzo@godzzow1:~/Current/swedishSignsSummer/images$ cat labels.csv  | grep PRIORITY_ROAD > PRIORITY_ROAD_labels.csv 
godzzo@godzzow1:~/Current/swedishSignsSummer/images$ cat PRIORITY_ROAD_labels.csv | wc -l
1122

godzzo@godzzow1:~/Current/swedishSignsSummer/images$ cat PRIORITY_ROAD_labels.csv | head -n 200 > test_labels.csv 
godzzo@godzzow1:~/Current/swedishSignsSummer/images$ cat PRIORITY_ROAD_labels.csv | tail -n 922 > train_labels.csv 

*/

var list = data.split(/\n/);
var recs = [];
var types = {};
var xml = [];
var csv = ["filename,width,height,class,xmin,ymin,xmax,ymax"];

list.forEach((element) => {
	var emain = element.split(":")
	
	if (emain.length > 1 && emain[1].trim().length > 1) {
		var erecs = emain[1].split(";")
		var image = emain[0];
		var objects = [];
		
		erecs.forEach((erec) => {
			var ecol = erec.split(", ");
			
			var rec = {
				image:	image,
				state:	ecol[0], 
				xmax:	ecol[1], 
				ymax:	ecol[2], 
				xmin:	ecol[3], 
				ymin:	ecol[4], 
				info:	ecol[5], 
				type:	ecol[6],
				name:	ecol[6]
			};
			
			if (rec.type) {
				if (!types[rec.type]) {
					types[rec.type] = 0;
				}
				
				rec.xmax = rec.xmax.replace(/\..*/, "");
				rec.ymax = rec.ymax.replace(/\..*/, "");
				rec.xmin = rec.xmin.replace(/\..*/, "");
				rec.ymin = rec.ymin.replace(/\..*/, "");
				
				types[rec.type]++;

				objects.push(`
	<object>
		<name>${rec.name}</name>
		<pose>Unspecified</pose>
		<truncated>0</truncated>
		<difficult>0</difficult>
		<bndbox>
			<xmin>${rec.xmin}</xmin>
			<ymin>${rec.ymin}</ymin>
			<xmax>${rec.xmax}</xmax>
			<ymax>${rec.ymax}</ymax>
		</bndbox>
	</object>
				`);
				
				recs.push(rec);
				
				csv.push(`${image},1280,960,${rec.type},${rec.xmin},${rec.ymin},${rec.xmax},${rec.ymax}`);
			}
		});
		
		if (objects.length > 0) {
			var xmlObjects = objects.join("\n");
			
			var xmlAnnotation = `
<annotation>
	<folder>Busz</folder>
	<filename>${image}</filename>
	<path>/home/godzzo/Current/swedishSignsSummer/images/${image}</path>
	<source>
		<database>Unknown</database>
	</source>
	<size>
		<width>1280</width>
		<height>960</height>
		<depth>3</depth>
	</size>
	<segmented>0</segmented>
	${xmlObjects}
</annotation>
		`;
			
			xml.push(xmlAnnotation.replace(/\n/g, " "));
		}
	}
});

console.log(csv.join("\n"));

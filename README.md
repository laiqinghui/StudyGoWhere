# StudyGoWhere



### Version
1.0


### Installation

1) Install NodeJS (>v4)
2) Install MongoDB in root directory of C: drive (eg. C:\mongodb)
3) Setup MongoDB
	1) Open cmd prompt as admin and change directory to C:\mongodb\bin
	2) Create two folder in that directory: "data" (i.e. C:\mongodb\data) and "log" (i.e. C:\mongodb\log)
	3) Create one folder in the "data" folder that is just created: "db" (i.e. C:\mongodb\data\db)
    4) In C:\mongodb\bin directory run the following two command to setup MongoDB: 
		"mongod --directoryperb --dbpath C:\mongodb\data\db --logpath C:\mongodb\log\mongo.log --logappend --rest --install"
		"net start MongoDB"
	5) Copy the "hotspotData.json" file from root of current Git repository to C:\mongodb\bin and run following command to populate database:
		"mongoimport --jsonArray --db studygowhere --collection hotspot < hotspotData.json"
		
4) Download/clone git repository and navigate to root of downloaded Git repository
5) Run "npm install" command to install dependencies 		

### Usage
Navigate to repository folder and run following command:
node app.js (crtl-c to quit)


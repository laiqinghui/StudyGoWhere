import populartimes
import datetime
from flask import Flask, jsonify, request

#Configuring Rest API
#--------------------
app = Flask(__name__)

print("Done configuring REST API!")
types = {"school", "cafe","food"}                                                                               

#lat, long is the coordinate of the hotspot
#day (1 to 7) represents Monday to Sunday
#hour (0 to 23) represents the 24 hour "Hour" portion of the time
def getPopularTime(lat, long, day, hour):
     lowerLat = lat - 0.000000000001
     lowerLong = long - 0.000000000001

     upperLat = lat + 0.000000000001
     upperLong = long + 0.000000000001
                                                             
     response = populartimes.get("AIzaSyByIfr3RCGNGx5hQpQJ309A3dpQxJkrAks", types, (lowerLat, lowerLong), (upperLat, upperLong))
     
     print(lat)
     print(long)
     if (len(response) > 0):
        print(response[0]['searchterm'])
        crowdPercentage = response[0]['populartimes'][day]['data'][hour];
        response = 0;
     else: crowdPercentage = 50;
     #rint(crowdPercentage)

     if(crowdPercentage < 25) :
        return "Low"
     elif (crowdPercentage >= 25 & crowdPercentage < 75  ):
        return "Medium"
     else :
        return "High"

 

#Functions declarations
#----------------------
@app.route('/populartimes', methods=['GET'])
def processAPI(): #function that will be called when api is accessed
    
    day = datetime.datetime.today().weekday();
    
    hour = datetime.datetime.today().hour
                                    
    #crowdLvl = getPopularTime(1.347261, 103.680358, day, hour);
    crowdLvl = getPopularTime(float(request.args['lat']), float(request.args['lon']), day, hour);
    try:
        
        return jsonify(crowd=crowdLvl,
                      )

    except (IndexError, IOError) as e:
        port.flushInput()
        port.flushOutput()
        return jsonify({'error': e.message}), 503

#Test functions
app.run(host='0.0.0.0')
#print("\n Crowd Level at Thursday at 9pm is")
#print(getPopularTime(1.301402647163571, 103.839275808341, 4-1, 21))
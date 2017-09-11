var directionsService = new google.maps.DirectionsService();
         var directionsDisplay = new google.maps.DirectionsRenderer();

         var map = new google.maps.Map(document.getElementById('map_panel'), {
           zoom:7,
           mapTypeId: google.maps.MapTypeId.ROADMAP
         });

         directionsDisplay.setMap(map);
         directionsDisplay.setPanel(document.getElementById('direction_panel'));

         var request = {
           origin: 'Toa Payoh',
           destination: 'NTU',
           travelMode: google.maps.DirectionsTravelMode.TRANSIT
         };

         directionsService.route(request, function(response, status) {
           if (status == google.maps.DirectionsStatus.OK) {
             directionsDisplay.setDirections(response);
           }
         });

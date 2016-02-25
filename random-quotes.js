$(document).ready(function(){
	var uid     = 4828,
		tokenid = "kWFzhilgsWsLUGnU";
		console.log("Document content loaded!!");
		function getQuote(){
			if ($("#quote") !== "" || $('#wiki-container') !== "") {
				$("#quote").empty();
				$("#author").empty();
				$("#wiki-container").empty();
			} else{console.log("Vacios, se procede.")};
			$.get("http://www.stands4.com/services/v2/quotes.php?uid=" + uid + "&tokenid=" + tokenid + "&searchtype=RANDOM", function(data){
				var xmlQuote  = data.getElementsByTagName("quote"),
					quote 	  = xmlQuote[0].childNodes[0],
					xmlAuthor = data.getElementsByTagName("author"),
					author    = xmlAuthor[0].childNodes[0];
				function wikiQuote (titles){
					var API_URL = "https://en.wikipedia.org/w/api.php";
					$.ajax({
					  url: API_URL,
					  data: { 
					  	action: 'parse', 
					  	page: titles, 
					  	format: 'json', 
					  	redirects: 1, 
					  	prop: 'text|images|externallinks|wikitext'
					  },
					  dataType: 'jsonp',
					  success: function (x) {
					    //console.log(x);
					    if(x.parse !== undefined){
					    	$('#wiki-container').append('<h1>Cargando contenido de wikipedia, favor de esperar.</h1>');
					    	//debugger;
					    	var wikiText = x.parse.text['*'];
					    	var el = $('<div></div>');
					    	//parseo del html de wikipedia
					    	el.html(wikiText);
					    	//expresiones regulares de las rutas de las ligas cuando se ejecuta de forma local
					    	//para testeo en local
					    	function testLocal(){
						    	var outerWiki   = /^[file:]+\/{3}\w+\.\w+/,
						    		innerWiki   = /^[file:]+\/{3}\w+\/\w+/,
						    		insidePage  = /Quotes\/index.html#\S+$/,
						    		outsidepage = /http:\/\//;
						    		//debugger;
						    	for (var i = 0; i < $('a', el).length; i++) {
						    		var blabla = $('a', el)[i].href;
						    		//debugger;
						    		var wtf = blabla.slice(7);
									if (insidePage.test(blabla)) {
										//console.log("Liga interna se deja igual " +blabla)
									} else if (outerWiki.test(blabla)) {
										$('a', el)[i].setAttribute('href', 'http:' + wtf);
										//debugger;
									} else if(innerWiki.test(blabla)){
										$('a', el)[i].setAttribute('href', 'http://en.wikipedia.org' + wtf);
										//debugger;
										//console.log("la liga corregida es " + $('a', el)[i].href);
									}else{
										//console.log("La liga debe estar bien porque no hubo cambios");
									}
						    	}
					    	}
					    	function testProduccion (){
					    		var innerWiki = /^\/\w+\/\w+/;
					    		var anchors = $("#wiki-container a");
					    		//debugger;
					    		for (var i = 0; i < anchors.length; i++){
					    			//debugger;
					    			var blabla = anchors[i].href;
					    			var wtf = blabla.slice(25);
					    			if(innerWiki.test(wtf)) {
					    				//debugger;
					    				anchors[i].setAttribute('href', 'http://en.wikipedia.org' + wtf);
					    			}
					    		}
					    	}
					    	console.log(x);
					    	//debugger;
					    	//testLocal();
					    	$("#wiki-container").empty();
					    	//debugger;
					    	$('#wiki-container').append($(".vcard", el)[0]);
					    	if($('p', el).first().text().length > 100){
					    		$('#wiki-container').append($('p', el)[0]);
					    	}else{
					    		$('#wiki-container').append($('p', el)[0]);
					    		$('#wiki-container').append($('p', el)[1]);
					    	}
					    	//debugger;
					    	testProduccion();
					    	for (var i = 0; i < $('#wiki-container img').length; i++) {
					    		var source    = $('#wiki-container img')[i].src;
					    		var newSource = source.slice(7);
					    		var se = $('#wiki-container img')[i];
					    		console.log(newSource);
					    		se.setAttribute('src', 'http://' + newSource);
					    		console.log(se);
					    		//debugger;
					    	}
					    }else{
					    	//console.log("No existe el autor");
					    	$('#wiki-container').append('<h1>Upps!! este autor no se encuentra en wikipedia!!</h1>');
					    }
					  }
					});
				}
				wikiQuote(author.textContent);
				$("#quote").append(quote);
				$("#author").append(author);
				$(".twitter-share-button").attr("href", "https://twitter.com/intent/tweet?text=");
			});		
		}

		$("#disparoQuotes").click(getQuote);
		//wikiQuote("Albert Einstein");
		getQuote();
});
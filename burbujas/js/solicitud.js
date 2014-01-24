//atributos
var y = d3.scale.linear()
	    .range([height, 0]);

var x = d3.scale.ordinal()
	  	.rangeRoundBands([0, width], .1);
//margenes:
var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
    width = 960 - margin.right,
    height = 500 - margin.top - margin.bottom;

/** aniovsDato
* Esta funcion se encarga de filtrar los datos de años como dato general, tupla[0] es el dato y 
* tupla [1] = es el valor del dato.
*/
function aniovsDato(data){
	//llaves: claves principales del data
	var llaves = Object.keys(data);
	//subllaves: claves que tiene el data en llaves
	var subllaves = null;
	//tupla:
	var tupla = null;
	//aux: variable auxiliar para contener las tuplas de cada año
	var aux = null;
	//contenedor: contenedor que contiene todos los datos convertidos para al final ser retornados
	var contenedor = new Array();
	for(var i = 0;i<llaves.length;i++){
		subllaves = Object.keys(data[llaves[i]]);
		aux = new Array();
		for(var j = 0; j<subllaves.length;j++){
			if(subllaves[j]!="empty"&&subllaves[j]!=""){
				tupla = new Array();
				tupla[0] = subllaves[j];
				tupla[1] = data[llaves[i]][subllaves[j]];
				aux[j] = tupla;
				tupla = null;
			}
		}
		if(aux.length>0){
			contenedor.push(aux);
		}
		else
		aux = null;
	}
	//se ordenan los datos antes de ser retornados
	for(var n=0;n<contenedor.length;n++){
		contenedor[n]=ordenar(contenedor[n]);
	}
	
	return contenedor;
}
/*
function x(d) { return d.datas.hombres; }
function y(d) { return d.datas.hombres; }
function radius(d) { return 25; }
function color(d) { return d; }
function key(d) { return d; }
*/
function solicitud(clave){

	//valores del genero
	var genero = Object.keys(clave.datas);
	var contenedor_final=new Array();
	var aux = null;
	for(var i =0;i<genero.length;i++){
		aux = aniovsDato(clave.datas[genero[i]]);
		contenedor_final.push(aux);
	}
	console.log('contenedor f:',contenedor_final);
	var largo_subllave = null;
	var maximo=0;
	var contenedor = null;
	var cant_datos = null;
	//se calcula el valor maximo contenido en el arreglo
	for(var i =0;i<contenedor_final.length;i++){
		contenedor = contenedor_final[i];
		cant_datos = contenedor.length;
		for(var x = 0;x<cant_datos;x++){
			largo_subllave= contenedor[x].length;
			if(maximo<contenedor[x][largo_subllave-1][1]){
					maximo=contenedor[x][largo_subllave-1][1];
			}
		}
	}
	console.log('maximo: ',maximo);
	//se grafican los datos
	for(var n =0;n<contenedor_final.length;n++){
		contenedor = contenedor_final[n];
		cant_datos = contenedor.length;
		for(var i = largo_subllave-1;i>=0;i--){
			for(j=0;j<cant_datos;j++){
				pos_dato = j;
				aux = contenedor[j][i][1];
				carga(aux,asig_color(contenedor[j][i][0]),cant_datos,pos_dato,maximo);
			}
		}
	}
	
}

function graficar(dato){

	
	circulo(90,90,"rojo",50);
	circulo(140,90,"verde",50);
}
/** circulo
* Esta funcion se encarga de pintar un circulo en las coordenadas
* x:cx & y:cy, con el color especificado y asignado como clase, y radio r
*/
function circulo(cx,cy,color,radio){
	var lienzo = d3.select('.lienzo')
		.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom);
	var circle = lienzo.append('circle')
		.attr('cy',cy)
		.attr('class',color)
		.attr('cx', cx)
		.attr('r',radio);
}

/**cargar_bar
* Esta function se encarga de crear los espacios para pintar las barras en la grafica
*/

function cargar_bar(lienzo,data,pos_dato,barWidth){
	if(bar!=null){
		bar=bar.data(data);
	    bar=bar.attr("transform", function(d) {return "translate(" + 0 + ",0)"; });
		return bar;
	}
	else{
		bar = lienzo.selectAll("g")
	    	.data(data)
	    	.enter().append("g")
	    	.attr("transform", function(d) {return "translate(" + 0 + ",0)"; });
	   	return bar;
	}
	
}
/** carga
* Esta funcion se encarga de graficar los datos enviados a través del parametro
* valor_dato: Es el valor a graficar
* color: color del que se graficara el valor
* cant_datos: es la cantidad de datos a lo largo del eje x a graficar (dominio)
* pos_dato: es la posicion del dato en la que se debe graficar
* maximo: Es el mayor de todos los datos, su funcion es establecer la regla para determinar el rango
*/
function carga(valor_dato,color, cant_datos,pos_dato,maximo){
	var data = [valor_dato];
	var y = d3.scale.linear()
	    .range([height, 0]);
	
   	var width = 960;
    /*height = 500;
	
	var y = d3.scale.linear()
	    .range([height, 0]);
	//asignacion de la clase y del tamaño del lienzo
	var lienzo = d3.select(".lienzo")
	    .attr("width", width)
	    .attr("height", height);
*/
	//--------------------- GRAFICACION ---------------------------
	//dominio de la grafica
	y.domain([0, maximo]);

	var barWidth = width / cant_datos;
	
	//cargar_bar(lienzo,data,pos_dato,barWidth);
	var cx = 30+ barWidth*(pos_dato) ,
		cy = height-pos_dato,
		color = color,
		radio = valor_dato/100;

	circulo(cx,cy,color,radio);
	/*
	bar.append("rect")
	    .attr("class", color)
	    .attr("x", function(d) { return 30+ barWidth*(pos_dato +0.1); })
	    .attr("y", function(d) { return y(d); })
	    .attr("height", function(d) { return height-y(d); })
	    .attr("width", barWidth*0.8);
	 
	bar.append("text")
	    .attr("x", barWidth*pos_dato+30+barWidth/2)
	    .attr("y", function(d) { return y(d) + 3; })
	    .attr("dy", ".75em")
	    .text(function(d) { return d; });
	*/
	}
/** ordenar
* Esta funcion se encarga  de ordenar los datos mediante insercion antes de ser graficados
*/
function ordenar(dato){
	console.log('dato: ',dato)
	var tam = dato.length;
	var temp,temp2,j;
	for(var i = 0;i<tam;i++){
		temp = dato[i][1];
		temp2 = dato[i];
		for(j = i-1;j>=0&&dato[j][1]>temp;j--){
			dato[j+1]=dato[j];
		}
		dato[j+1]=temp2;
	}
	return dato;
}

/** color
* Esta funcion se encarga de asignar el color deseado a cada dato
*/
function asig_color(anio){
	var color_r= "negro";
	switch(anio){
		case '1' : 
					color_r = 'rojo';
					break;
		case '2' : 
					color_r = 'azul';
					break;
		case '3' : 
					color_r = 'verde';
					break;
		case '4' : 
					color_r = 'amarillo';
					break;
		case '5' : 
					color_r = 'negro';
					break;			
		case '2006': 
					color_r = "rojo";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2007':
					color_r = "azul";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2008':
					color_r = "verde";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2009':
					color_r = "amarillo";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2010':
					color_r = "negro";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2011':
					color_r = "morado";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		case '2012':
					color_r = "rosa";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
		default:
					color_r="negro";
					//$('#referencia').append("div").attr("class=",color_r);
					break;
	}
	return color_r;

}

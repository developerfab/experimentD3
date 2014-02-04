//atributos
var margin , width , height ;
//margenes:
/** dimension
* Esta funcion se encarga de revisar el tamaño del exporador y asignar el tamaño del lienzo de acuerdo
* a sus dimensiones.
*/
function dimension(){
	//se limpia el lienzo:
	//$('.lienzo').empty();
	margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
    width = (window.innerWidth*0.8)- margin.right,
    height = (window.innerHeight*0.7) - margin.top - margin.bottom;
}


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
	//se insertan los datos en el arreglo y se descantan los que contienen las llaves 'empty' y ''
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
/** solicitud
* Esta funcion se encarga de recibir la peticion enviada por el usuario a través del dato
* 'clave' el cual contiene el diccinario a procesar. Para este caso se hace uso del diccionario
* de ejemplo del archivo html, por ello varias de las variables tienen nombres relacionados con este.
*/
function solicitud(clave){
	//tamaño del lienzo
	dimension();
	//valores del genero
	var genero = Object.keys(clave.datas);
	//contenedor que contendra todos los datos del diccionario contenidos en un array
	var contenedor_final=new Array();
	var aux = null;
	var largo_subllave = null;
	//maximo: valor del dato mas grande de todo el diccionario
	var maximo=0;
	//contenedor: subdivisiones del contenedor final, contiene los datos generados de cada genero
	var contenedor = null;
	//cant_datos: para este ejemplo, será el numero de datos de cada genero
	var cant_datos = null;
	//datos_y: cantidad de datos que se graficaran a lo largo del eje y
	var datos_y = genero.length;
	//se envian los datos para ser organizados y se asigna la respuesta al contenedor_final
	for(var i =0;i<genero.length;i++){
		aux = aniovsDato(clave.datas[genero[i]]);
		contenedor_final.push(aux);
	}
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

	//se grafican los datos
	for(var n =0;n<contenedor_final.length;n++){
		contenedor = contenedor_final[n];
		cant_datos = contenedor.length;
		for(var i = largo_subllave-1;i>=0;i--){
			for(j=0;j<cant_datos;j++){
				pos_dato = j;
				aux = contenedor[j][i][1];
				carga(aux,asig_color(genero[n]),cant_datos,pos_dato,maximo, n, datos_y);
			}
		}
	}
	
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
		.attr('r',radio)
		.attr('stroke','black');
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
function carga(valor_dato,color, cant_datos,pos_dato,maximo,pos_y, datos_y){
	var data = [valor_dato];
	var y = d3.scale.linear()
	    .range([height, 0]);
	    
	//--------------------- GRAFICACION ---------------------------
	//dominio de la grafica
	y.domain([0, maximo]);

	var barWidth = width / cant_datos;
	var barHeigth = height / datos_y;
	var cx = 30+ barWidth*(pos_dato);
	var radio = valor_dato/100;
	if(width<250){
		radio = valor_dato/1000;
	}
	var cy = height-(barHeigth*pos_y),
		color = color;
	//se llama la funcion que graficara el circulo
	circulo(cx,cy,color,radio);
	
	}
/** ordenar
* Esta funcion se encarga  de ordenar los datos mediante insercion antes de ser graficados
*/
function ordenar(dato){
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
		case 'hombres' : 
					color_r = 'rojo';
					break;
		case 'mujeres' : 
					color_r = 'azul';
					break;
		default:
					color_r="negro";
					break;
	}
	return color_r;

}

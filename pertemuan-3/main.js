function main() {
    //inisiasi webgl
        //mengambil value pada inputan yang ada di html
        //canvar adalah pointer yang mengarah ke canvas
    var canvas = document.getElementById("myCanvas"); 
        //to get an access to a webgl context for 2D &/ 3D graphics rendering
    var gl = canvas.getContext("webgl"); 
        //gl=alat tulis, canvas=kertas
    
    function resize(canvas) {
      // Lookup the size the browser is displaying the canvas.
      var displayWidth  = canvas.clientWidth;
      var displayHeight = canvas.clientHeight;
     
      // Check if the canvas is not the same size.
      if (canvas.width  != displayWidth ||
          canvas.height != displayHeight) {
     
        // Make the canvas the same size
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
        canvas.width = canvas.height; // mengubah menjadi persegi (rasio 1:1)
      }
    }
    resize(gl.canvas);

    var vertices = [
      0.25, 0.25,     // titik A
      0.25, -0.25,    // titik B
      -0.25, -0.25,   // titik C
      -0.25, 0.25,    // titik D
    ];
      
    var vertexBuffer = gl.createBuffer(); //VBO(VertexBufferObject)==position buffer, adl pointer ke buffer yg ada di GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); //utk binding, menyimpan alamat
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); //memasukan data
    gl.bindBuffer(gl.ARRAY_BUFFER, null); //memutus binding. agar saat ada operasi lain gaakan ada accident salah isi
      /*
        gl.createBuffer -> buffernya GPU
        ARRAY_BUFFER -> buffernya webgl
      */

    //vertexshader(GPU) = shader yang memproses setiap vertex. (manipulasi/perpindahan/transformasi warna, posisi, tekstur koordinat benda)
    //fragmentshader (GPU) = tempat pewarnaan pixel. (perhitungan/komputasi warna, cahaya, tekstur, bayangan, specular highlights, translucency, atribut pixel lainnya)

    // cara lain, jadi code untuk 2 dibawah ini ditaroh di html
    // var vertexShaderSource = document.getElementById("vertexShaderSource").text
    // var vertexShaderSource = document.getElementById("fragmentShaderSource").text

    //inisiasi shader (penampung a)
        //utk mendapatkan string kode GLSL untuk kedua shader
        //attribute vec2 a_Position ==> penangkap buffer utk vertex ttntu utk stiap iterasi vertexshader. 
          // krn tiap iterasi vertexshader, berharap memproses vertex tertentu saja. memastikan utk memroses vertex ttntu.
          // vec2 karena mau 22
          // a_Position var boleh ganti apapun
    var vertexShaderSource = `
      attribute vec2 a_Position;
      void main() {
        gl_PointSize = 100.0;
        gl_Position = vec4(a_Position, 0.0, 1.0);
      } 
    `; //vec4(0.0, 0.0, 0.0, 1.0); == posisi tengah. (x, y, z, w) ttp ditulis z==0 meski 2D

    //warna titik
    var fragmentShaderSource = `
      void main() {
        gl_FragColor = vec4(0.47, 0.82, 0.59, 2.0); 
      }
    `; 

    //membuat objek WebGLShader dengan input type shader [pembuatan shader (misal: b)]
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    //menentukan kode GLSL untuk shader (ibarat ngetik source code ke a) 
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    //kompilasi glsl shader ke binary data jd bisa digunakan oleh webgl program (a jadi b)
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    //membuat objek webgl program (misal: penampung c)
    var shaderProgram = gl.createProgram();

    //menentukan shader mana yang akan digunakan (masukin adonan b ke penampung c)
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    //link webgl program ke attached shader (ibarat menggabungkan "adonan" yg ada di c)
    gl.linkProgram(shaderProgram);

    //menggunakan webgl program menjadi current rendering state (ibarat mulai menggukan cat c ke dalam konteks grafika (penggambaran))
    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    var aPositionLoc = gl.getAttribLocation(shaderProgram, "a_Position"); //pointer utk menyambungkan js dg attribute yg ada di vertexshader
    gl.vertexAttribPointer(aPositionLoc, 2 , gl.FLOAT, false, 0, 0); //attribute yg di GPU menunjuk ke vertexBuffer
    gl.enableVertexAttribArray(aPositionLoc); //aktivasi agar vertexAttribnya bisa menyala
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    /*
      gl.vertexAttribPointer(index, size, type, normalized, stride, offset)
          aPositionLoc = membantu proses maping attribute. jembatan ke attribute
          size = size dari dimensi yg ingin ditarik. 1 att berapa isinya. (mis: x dan y berarti vector 2)
          type = defaultnya float (masing2 elemen dr vec itu)
          normalized = 
          stride = case by case. misal: 
                position 2 (xy), color 3 (RGB). maka tiap vertex butuh sizenya 5. maka stridenya 5.
                kalo misal punya aColor maka stridenya diisi 2. color mulainya dari index 2.
          offset =
    */

    //pake warna gl.clearColor(red, green, blue, alpha);
    gl.clearColor(0.73, 0.47, 0.82, 0.8); //canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  

    var primitive = gl.TRIANGLE_FAN;
    var offset = 0;
    var nVertex = 4; //juml vertex yg akan digambar
    gl.drawArrays(primitive, offset, nVertex);
}
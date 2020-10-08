function main() {
    //inisiasi webgl
        //mengambil value pada inputan yang ada di html
    var canvas = document.getElementById("myCanvas"); 
        //to get an access to a webgl context for 2D &/ 3D graphics rendering
    var gl = canvas.getContext("webgl"); 

    //vertexshader(GPU) = shader yang memproses setiap vertex. (manipulasi/perpindahan/transformasi warna, posisi, tekstur koordinat benda)
    //fragmentshader (GPU) = tempat pewarnaan pixel. (perhitungan/komputasi warna, cahaya, tekstur, bayangan, specular highlights, translucency, atribut pixel lainnya)

    //inisiasi shader (penampung a)
        //utk mendapatkan string kode GLSL untuk kedua shader
    var vertexShaderSource = `
      void main() {
        gl_PointSize = 50.0;
        gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
      }
    `;
    var fragmentShaderSource = `
      void main() {
        gl_FragColor = vec4(0.47, 0.82, 0.59, 1.0);
      }
    `;

    //membuat objek WebGLShader dengan input type shader [pembuatan shader (misal: b)]
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    /*
        gl.shaderSource(shader, source)
        replace the source code in a shader object (WebGL API sets the source code of a WebGLShader)
            shader
                A WebGLShader object in which to set the source code.
            source
                A DOMString containing the GLSL source code to set. 
    */
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

    //pake warna gl.clearColor(red, green, blue, alpha);
    gl.clearColor(0.73, 0.47, 0.82, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  
    gl.drawArrays(gl.POINTS, 0, 1);
}
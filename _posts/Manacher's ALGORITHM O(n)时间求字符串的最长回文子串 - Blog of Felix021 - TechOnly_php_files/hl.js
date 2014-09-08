var isIE = navigator.userAgent.indexOf("MSIE") >= 0 ? true : false;
var keywords = Array(
        "include", "if", "define", "for", "while",
        "switch", "case", "do", "else", "struct",
        "class", "public", "private", "import",
        "default", "int", "long", "char", "unsigned",
        "short", "string", "float", "double", "typedef",
        "return", "try", "catch", "throw", "bool", 
        "true", "false", "using", "namespace", "void",
        "std", "cin", "cout", "printf", "scanf", "static",
        "inline", "friend", "operator", "new", "delete",
        "protected", "const", "break", "continue", "NULL",
        "__int64", "var", "__construct", "__destruct",
        "sizeof", "ifdef", "endif", "ifundef", "undef",
        "pragma", "__attribute__", "function", "array",
        "foreach", "trim", "preg_match", "preg_replace",
        "eot", "String", "Class", "forName", "\\w*Exception",
        "null", "echo", "fi", "esac", "done", "then", "register",
        "except", "elif", "True", "False", "as", "from", "map",
        "reduce", "in", "def", "lambda"
    );

function highlight(obj){
  try{
    var str = obj.innerHTML;

    regs = ("\\b(" + keywords + ")\\b").replace(/,/g, "|");
    var reg = new RegExp(regs, "g");
    str = str.replace(reg, '<span class="kw">$&</span>');

    obj.innerHTML = str;
  }catch(e){alert(e);}
}

function highlighter(){
  try{
    var codes = document.getElementsByTagName("div");
    for(i = 0; i < codes.length; ++i){
        var clsname = '';  

        if(isIE) { 
             var cls = codes[i].getAttributeNode('class'); 
             if(cls) clsname = cls.value;
        }
        else clsname = codes[i].getAttribute("class");  
        if(clsname == "code") highlight(codes[i]);
    }
  }catch(e){}//no arribute as class
}

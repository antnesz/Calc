const textoExpressaoAnterior = document.querySelector(".expressao-anterior");
const textoExpressaoAtual = document.querySelector(".expressao-atual");

const botaoCalcular = document.querySelector("#calcular");
const botaoLimpar = document.querySelector("#limpar");
const botaoDeletar = document.querySelector("#deletar");
const botoesOperadores = document.querySelectorAll(".operadores");
const botoesNumeros = document.querySelectorAll(".digitos");
const botaoSinal = document.querySelector("#sinal");

botaoCalcular.addEventListener("click", () => 
{
  calc.calcular();
});

botaoLimpar.addEventListener("click", () =>
{
  calc.limparTela();
});

botaoDeletar.addEventListener("click", () =>
{
  calc.deletar();
});

botoesNumeros.forEach((botaoNumero) => 
{
  botaoNumero.addEventListener("click", () => 
  {
    const valorNumero = botaoNumero.innerText;
    
    calc.tratarNumero(valorNumero);
  });
});

botoesOperadores.forEach((botaoOperador) => 
{
  botaoOperador.addEventListener("click", () => 
  {
    const valorOperador = botaoOperador.innerText;

    calc.escolherOperador(valorOperador);
  });
});

botaoSinal.addEventListener("click", () => 
{
  calc.mudarSinal();
});

class calculadora 
{
  constructor (textoExpressaoAnterior, textoExpressaoAtual)
  {
    this.textoExpressaoAnterior = textoExpressaoAnterior;
    this.textoExpressaoAtual = textoExpressaoAtual;
    this.expressaoAnterior = "";
    this.expressaoAtual = "";

    this.sinal = "positivo";
    this.operadorSelecionado = "indefinido";
  }

  limparTela()
  {
    this.expressaoAtual = "";
    this.expressaoAnterior = "";
    this.sinal = "positivo";
    this.operadorSelecionado = "indefinido";
    calc.atualizarTela()
  }

  deletar()
  {
    if (this.expressaoAtual === "-") { return }

    this.expressaoAtual = this.expressaoAtual.slice(0, -1);
    calc.atualizarTela();
  }

  /*
    bloqueia expressões como "02"(zero desnecesários a esquerda), 
    "0,123,321"(duas ou mais virgulas em um número decimal) e ",123"(virgula colocada ao início)
  */
  tratarNumero(valorNumero) 
  {
    if (valorNumero === "," && this.expressaoAtual.includes(",") 
    || valorNumero === "," && this.expressaoAtual == "" 
    || valorNumero === "0" && this.expressaoAtual == "0"
    || valorNumero === "0" && this.expressaoAtual == "-0") { return }

    else if (!(valorNumero === ",") && this.expressaoAtual == "0" || !(valorNumero === ",") && this.expressaoAtual == "-0")
    {
      this.expressaoAtual = this.expressaoAtual.replace(0, valorNumero);
      calc.atualizarTela();

      return;
    }
    
    calc.adicionarNumero(valorNumero);
  }

  adicionarNumero(valorNumero) // (1, 2, 3, 4, 5, 6, 7, 8, 9, 0, ",")
  {
    this.expressaoAtual += valorNumero;
    calc.atualizarTela();
  }

  mudarSinal() 
  {
    if (this.sinal === "positivo") 
    {
      this.sinal = "negativo";

      this.expressaoAtual = "-" + this.expressaoAtual; // Adiciona o sinal "-"
      calc.atualizarTela();
    }
    else 
    {
      this.sinal = "positivo";

      this.expressaoAtual = this.expressaoAtual.slice(1); // Remove o sinal "-"
      calc.atualizarTela();
    }
  }

  escolherOperador(valorOperador) // (+, -, ×, ÷, %)
  {
    if (this.expressaoAtual === "" && this.expressaoAnterior.length > 2) {
      this.textoExpressaoAnterior.innerText = this.expressaoAnterior.substring(0, this.expressaoAnterior.length-1) + valorOperador;
      this.expressaoAnterior = this.expressaoAnterior.substring(0, this.expressaoAnterior.length-1) + valorOperador;
      return;
    }

    if (this.expressaoAtual === ""
    || (valorOperador === "+" && this.operadorSelecionado === "soma")
    || (valorOperador === "-" && this.operadorSelecionado === "subtração")
    || (valorOperador === "×" && this.operadorSelecionado === "multiplicação")
    || (valorOperador === "÷" && this.operadorSelecionado === "divisão")) { return }

      if (!this.expressaoAnterior.endsWith(valorOperador) && this.expressaoAnterior.length > 2) {
        this.textoExpressaoAnterior.innerText = this.expressaoAnterior.substring(0, this.expressaoAnterior.length-1) + valorOperador;
        this.expressaoAnterior = this.expressaoAnterior.substring(0, this.expressaoAnterior.length-1) + valorOperador;
        return;
      }

      switch (valorOperador)
      {
        case "+":
          this.expressaoAnterior = this.expressaoAtual + " +"
          this.operadorSelecionado = "soma";
        break;
        case "-":
          this.expressaoAnterior = this.expressaoAtual + " -"
          this.operadorSelecionado = "subtração";
        break;
        case "×":
          this.expressaoAnterior = this.expressaoAtual + " ×"
          this.operadorSelecionado = "multiplicação";
        break;
        case "÷":
          this.expressaoAnterior = this.expressaoAtual + " ÷"
          this.operadorSelecionado = "divisão";
        break;
      }
      
      this.expressaoAtual = "";
      this.textoExpressaoAnterior.innerText = this.expressaoAnterior;
    }

  calcular()
  {
    if (this.operadorSelecionado === "indefinido") { return }
    
    let primeiroNumero = this.expressaoAnterior.slice(0,-2);
    primeiroNumero = parseFloat(primeiroNumero.replace(/\,/g, '.'));
    let segundoNumero = parseFloat(this.expressaoAtual.replace(/\,/g, '.'));
    let resultado = 0;

    if (this.expressaoAtual === "") {segundoNumero = primeiroNumero;}

    switch (this.operadorSelecionado)
    {
      case "soma":
        resultado = primeiroNumero + segundoNumero;
      break; 
      case "subtração":
        resultado = primeiroNumero - segundoNumero;
      break; 
      case "multiplicação":
        resultado = primeiroNumero * segundoNumero;
      break; 
      case "divisão":
        resultado = primeiroNumero / segundoNumero;
      break; 
    }

    this.expressaoAnterior = this.expressaoAnterior + " " + segundoNumero;
    console.log(this.expressaoAnterior)
    resultado.toString().replace(/\./g, ',');
    this.expressaoAtual = resultado;
    calc.atualizarTela();
  }

  atualizarTela()
  {
    this.textoExpressaoAnterior.innerText = this.expressaoAnterior;
    this.textoExpressaoAtual.innerText = this.expressaoAtual;
  }
}

const calc = new calculadora(textoExpressaoAnterior, textoExpressaoAtual)



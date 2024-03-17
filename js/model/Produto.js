class Produto {
    constructor(obj){
        obj = obj || {}
        this.id = obj.id;
        this.nome = obj.nome;
        this.quantidadeEstoque = obj.quantidadeEstoque;
        this.valor = obj.valor;
        this.observacao = obj.observacao;
        this.dataCadastro = obj.dataCadastro;
    }

    validar(){ 
        return !!(this.quantidadeEstoque && this.valor);  
    }
}
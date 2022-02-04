// Other techniques for learning

class ActivationFunction {
    constructor(func, dfunc) {
      this.func = func;
      this.dfunc = dfunc;
    }
  }
  
  let sigmoid = new ActivationFunction(
    x => 1 / (1 + Math.exp(-x)),
    y => y * (1 - y)
  );
  
  let tanh = new ActivationFunction(
    x => Math.tanh(x),
    y => 1 - (y * y)
  );
  
  
  class NeuralNetwork {
    /*
    * if first argument is a NeuralNetwork the constructor clones it
    * USAGE: cloned_nn = new NeuralNetwork(to_clone_nn);
    */
    constructor(a, b, c) {    
      // a: number of input nodes - or another neural network object (in that case, we don't need to specify b and c)
      // b: list of number of hidden nodes in each layer (as many array elements, as many hidden layers there are)
      // c: number of output nodes    
      if (a instanceof NeuralNetwork) {
        this.input_nodes = a.input_nodes;
        
        this.hidden_nodes = [];      
        for (let i = 0; i < a.hidden_nodes.length; i++)
          this.hidden_nodes.push(a.hidden_nodes[i]);
  
        this.output_nodes = a.output_nodes;
  
        this.weights_ih = a.weights_ih.copy();
        this.weights_hidden = [];
        for (let i = 0; i < a.weights_hidden.length; i++)
          this.weights_hidden[i] = a.weights_hidden[i].copy();
        this.weights_ho = a.weights_ho.copy();
  
        this.bias_hidden = [];
        for (let i = 0; i < a.bias_hidden.length; i++)
          this.bias_hidden[i] = a.bias_hidden[i].copy();
        this.bias_o = a.bias_o.copy();
      }
      else {
        this.input_nodes = a;
        this.hidden_nodes = [];
        for (let i = 0; i < b.length; i++)
          this.hidden_nodes.push(b[i]);
        this.output_nodes = c;
  
        this.weights_ih = new Matrix(this.hidden_nodes[0], this.input_nodes);
        this.weights_hidden = [];
        for (let i = 0; i < this.hidden_nodes.length - 1; i++) {
          this.weights_hidden[i] = new Matrix(this.hidden_nodes[i+1], this.hidden_nodes[i]);
          this.weights_hidden[i].randomize();
        }
        this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes[this.hidden_nodes.length - 1]);
        this.weights_ih.randomize();
        this.weights_ho.randomize();
  
        this.bias_hidden = [];
        for (let i = 0; i < b.length; i++) {
          this.bias_hidden[i] = new Matrix(this.hidden_nodes[i], 1);
          this.bias_hidden[i].randomize();
        }
  
        this.bias_o = new Matrix(this.output_nodes, 1);
        this.bias_o.randomize();
      }
  
      // TODO: copy these as well
      this.setLearningRate();
      this.setActivationFunction();
    }
  
    predict(input_array) {
  
      // Generating the Hidden Outputs
      let inputs = Matrix.fromArray(input_array);
  
      let hidden = [];    
      hidden[0] = Matrix.multiply(this.weights_ih, inputs);
      hidden[0].add(this.bias_hidden[0]);
      // activation function!
      hidden[0].map(this.activation_function.func);
  
      for (let i = 1; i < this.hidden_nodes.length; i++) {
        hidden[i] = Matrix.multiply(this.weights_hidden[i - 1], hidden[i - 1]);
        hidden[i].add(this.bias_hidden[i]);
        // activation function!
        hidden[i].map(this.activation_function.func);  
      }
  
      // Generating the output's output!
      let output = Matrix.multiply(this.weights_ho, hidden[hidden.length - 1]);
      output.add(this.bias_o);
      output.map(this.activation_function.func);
      
      // Sending back to the caller!
      return output.toArray();
    }
  
    setLearningRate(learning_rate = 0.1) {
      this.learning_rate = learning_rate;
    }
  
    setActivationFunction(func = sigmoid) {
      this.activation_function = func;
    }
  
  
    serialize() {
      return JSON.stringify(this);
    }
  
    static deserialize(data) {
      if (typeof data == 'string') {
        data = JSON.parse(data);
      }    
      let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
      nn.weights_ih = Matrix.deserialize(data.weights_ih);
      nn.weights_hidden = [];    
      for (let i = 0; i < nn.hidden_nodes.length - 1; i++)
        nn.weights_hidden[i] = Matrix.deserialize(data.weights_hidden[i]);    
      nn.weights_ho = Matrix.deserialize(data.weights_ho);
      for (let i = 0; i < nn.hidden_nodes.length; i++)
        nn.bias_hidden[i] = Matrix.deserialize(data.bias_hidden[i]);
      nn.bias_o = Matrix.deserialize(data.bias_o);
      nn.learning_rate = data.learning_rate;
      return nn;
    }
  
    // Adding functions for neuro-evolution
    copy() {
      return new NeuralNetwork(this);
    }
  
    mutate(rate) {
      function mutate(val) {
        if (Math.random() < rate) {        
          //return Math.random() * 2 - 1;
          return val + randomGaussian(0, 0.1);
        } else {
          return val;
        }
      }
  
      this.weights_ih.map(mutate);
      for (let i = 0; i < this.weights_hidden.length; i++)
        this.weights_hidden[i].map(mutate);
      this.weights_ho.map(mutate);
      for (let i = 0; i < this.bias_hidden.length; i++)
        this.bias_hidden[i].map(mutate);    
      this.bias_o.map(mutate);
    }
  }
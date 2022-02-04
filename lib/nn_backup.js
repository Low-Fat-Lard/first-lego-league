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
  constructor(a, b, b2, c) {
    // TODO: document what a, b, b2 and c are
    if (a instanceof NeuralNetwork) {
      this.input_nodes = a.input_nodes;
      this.hidden1_nodes = a.hidden1_nodes;
      this.hidden2_nodes = a.hidden2_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_ih = a.weights_ih.copy();
      this.weights_h1h2 = a.weights_h1h2.copy();
      this.weights_ho = a.weights_ho.copy();

      this.bias_h1 = a.bias_h1.copy();
      this.bias_h2 = a.bias_h2.copy();
      this.bias_o = a.bias_o.copy();
    }
    else {
      this.input_nodes = a;
      this.hidden1_nodes = b;
      this.hidden2_nodes = b2;
      this.output_nodes = c;

      this.weights_ih = new Matrix(this.hidden1_nodes, this.input_nodes);
      this.weights_h1h2 = new Matrix(this.hidden2_nodes, this.hidden1_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden2_nodes);
      this.weights_ih.randomize();
      this.weights_h1h2.randomize();
      this.weights_ho.randomize();

      this.bias_h1 = new Matrix(this.hidden1_nodes, 1);
      this.bias_h2 = new Matrix(this.hidden2_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_h1.randomize();
      this.bias_h2.randomize();
      this.bias_o.randomize();
    }

    // TODO: copy these as well
    this.setLearningRate();
    this.setActivationFunction();


  }

  predict(input_array) {

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden1 = Matrix.multiply(this.weights_ih, inputs);
    hidden1.add(this.bias_h1);
    // activation function!
    hidden1.map(this.activation_function.func);

    let hidden2 = Matrix.multiply(this.weights_h1h2, hidden1);
    hidden2.add(this.bias_h2);
    // activation function!
    hidden2.map(this.activation_function.func);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, hidden2);
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
    let nn = new NeuralNetwork(data.input_nodes, data.hidden1_nodes, data.hidden2_nodes, data.output_nodes);
    nn.weights_ih = Matrix.deserialize(data.weights_ih);
    nn.weights_h1h2 = Matrix.deserialize(data.weights_h1h2);
    nn.weights_ho = Matrix.deserialize(data.weights_ho);
    nn.bias_h1 = Matrix.deserialize(data.bias_h1);
    nn.bias_h2 = Matrix.deserialize(data.bias_h2);
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
    this.weights_h1h2.map(mutate);
    this.weights_ho.map(mutate);
    this.bias_h1.map(mutate);
    this.bias_h2.map(mutate);
    this.bias_o.map(mutate);
  }
}

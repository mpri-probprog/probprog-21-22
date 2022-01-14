// Dices
var sumD = function(){
  var d1 = 1+sample(RandomInteger({n:6}));
  var d2 = 1+sample(RandomInteger({n:6}));
  condition(d1-d2==1);
  return d1+d2;
}

var sumDdist = Infer(sumD);
viz(sumDdist)

///////////////////
// Coins

var model = function ( ) {
  var x = sample( Uniform ( { a : 0 , b : 1 } ) )
  return ( x <= 0.1)
}
viz(Infer(model))

var model=function(){
  var x = sample(Bernoulli({p:0.2}))
  var y = sample(Bernoulli({p:0.2}))
  condition ((x & !y)|(!x & y))
  return x
}
viz(Infer(model))

/////////////////////////
// Canabis


var canabis = function(){
  var smoke = sample( Bernoulli( {p:0.6}));
  var coin = sample( Bernoulli({ p:0.5 }));
  var x = coin ? true : smoke
  condition(x)
  return smoke
}
viz(Infer(canabis))

var model = function(){
  var p = sample(Uniform({a:0, b:1}))
  var answer = function(){
    var smoke = sample( Bernoulli( {p:p}));
    var coin = sample( Bernoulli({ p:0.5 }));
    var x = coin ? true : smoke
    return x
  }
  condition(sum(repeat(200,answer))==160)
  return p
}
viz(Infer(model))

var model = function(){
  var p = sample(Uniform({a:0, b:1}))
  var answers = repeat(200,function(){
    var smoke = sample(Bernoulli( {p:p}));
    var coin = sample(Bernoulli( {p:0.5}));
    return coin ? true : smoke
  })
  // Compute proportion of Yes
  var YP = sum(answers)/200
  // Score with respect to a binomial of bias YP
  // compared with data
  observe(Binomial({n:200, p:YP}),160)
  return p
}
// Infer with Importance Sampling 
viz(Infer({method: 'SMC', particles:2000, model:model}))


////////////////////
// Linear Regression

var xs = [0, 1, 2, 3];
var ys = [0, 1, 4, 6];

var model = function() {
  var m = gaussian(0, 2);
  var b = gaussian(0, 2);
  var sigma = gamma(1, 1);

  var f = function(x) {
    return m * x + b;
  };

  map2(
    function(x, y) {
      observe(Gaussian({mu: f(x), sigma: sigma}), y);
    },
    xs,
    ys);

  return {b:m};
}

viz.auto(Infer({method: 'MCMC', samples: 10000}, model));



var xs = [0, 1, 2, 3];
var ys = [0, 1, 4, 6];
var df = function(x){return 2*x-0;5}
viz.line([0,3],[df(0),df(3)])
viz.scatter(xs,ys)

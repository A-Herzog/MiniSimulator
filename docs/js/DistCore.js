/*
Copyright 2023 Alexander Herzog

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export {distcore}

const distcore={};





distcore.exp=function(mean) {
  return -mean*Math.log(1.0-Math.random());
}

distcore.uniform=function(a,b) {
  return a+(b-a)*Math.random();
}

distcore.lognormal=function(mu,sigma) {
  let q=10;
  let u=0;
  let v=0;

  while (q==0 || q>=1) {
    u=2*Math.random()-1;
    v=2*Math.random()-1;
    q=u*u+v*v;
  }

  const p=Math.sqrt(-2*Math.log(q)/q);
  const product=p*sigma;
  return Math.exp(u*product+mu);
}

distcore.gamma=function(shape,scale) {
  /*
   * see org.apache.commons.math3.distribution.GammaDistribution.sample()
   * By using this method wie avoid creating a GammaDistribution object each time a random number is needed.
   */
  if (shape < 1) {
    /* [1]: p. 228, Algorithm GS */

    while (true) {
      /* Step 1: */
      const u = Math.random();
      const bGS = 1.0 + shape/Math.E;
      const p = bGS * u;

      if (p <= 1) {
        /* Step 2: */

        const x = Math.pow(p, 1 / shape);
        const u2 = Math.random();

        if (u2 > Math.exp(-x)) {
          /* Reject */
          continue;
        } else {
          return scale * x;
        }
      } else {
        /* Step 3: */

        const x = -1 * Math.log((bGS - p) / shape);
        const u2 = Math.random();

        if (u2 > Math.pow(x, shape - 1)) {
          /* Reject */
          continue;
        } else {
          return scale * x;
        }
      }
    }
  }

  /* Now shape >= 1 */

  const d = shape - 0.333333333333333333;
  const c = 1 / (3 * Math.sqrt(d));

  while (true) {
    const x = Math.cos(2*Math.PI*Math.random())*Math.sqrt(-2*Math.log(Math.random())); /* = N(0,1) random number */
    const v = (1 + c * x) * (1 + c * x) * (1 + c * x);

    if (v <= 0) {
      continue;
    }

    const x2 = x * x;
    const u = Math.random();

    /* Squeeze */
    if (u < 1 - 0.0331 * x2 * x2) {
      return scale * d * v;
    }

    if (Math.log(u) < 0.5 * x2 + d * (1 - v + Math.log(v))) {
      return scale * d * v;
    }
  }
}

distcore.get=function(info) {
  if (typeof(info)=="undefined") return function(){return 0;}
  if (info==null) return function(){return 0;}
  if (typeof(info)=="number") return function(){return info;}
  if (typeof(info)=="function") return info;
  if (typeof(info)!="string") return function(){return 0;}
  if (info=="") return function(){return 0;}

  const pos1=info.indexOf("(");
  const pos2=info.indexOf(")");
  if (pos1<0 || pos2<0) return function(){return 0;}

  const name=info.substring(0,pos1).toLowerCase();
  const param=info.substring(pos1+1,pos2).split(";");

  for (let i=0;i<param.length;i++) param[i]=parseFloat(param[i]);

  if (name=="const" && param.length==1) return function(){return param[0];};
  if (name=="uniform" && param.length==2) return function(){return distcore.uniform(param[0],param[1]);};
  if (name=="exp" && param.length==1) return function(){return distcore.exp(param[0]);};
  if (name=="lognormal" && param.length==2) {
    const mean=param[0];
	const sd=param[1];
    const sigma2=Math.log(Math.pow(sd/mean,2)+1);
    const mu=Math.log(mean)-sigma2/2;
    const sigma=Math.sqrt(sigma2);
	return function(){return distcore.lognormal(mu,sigma);};
  }
  if (name=="gamma" && param.length==2) {
    const mean=param[0];
    const sd=param[1];
    const scale=sd*sd/Math.max(mean,0.000001);
	const shape=mean/Math.max(scale,0.000001);
    if (Math.abs(shape-1)<0.00000001) {
      /* Ist Exp-Verteilung mit E=1/(1/beta) */
	  return function(){return distcore.exp(scale);};
    }
	return function(){return distcore.gamma(shape,scale);};

	// alpha=Shape
	// beta=Scale

	// final double d2=sd*sd/Math.max(mean,0.000001);
	// final double d1=mean/Math.max(d2,0.000001);
	// d2=Scale=sd*sd/Math.max(mean,0.000001);
	// d1=Shape=mean/Math.max(Scale,0.000001);

    // return new GammaDistribution(d1,d2);
  }

  return null;
}
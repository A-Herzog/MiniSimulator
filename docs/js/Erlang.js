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

export {PotenzFakultaet, MMcZustandsP0, MMcZustandsP, ErlangC_P1, ErlangC_P2, ErlangC, ErlangC_ENQ, ErlangC_EN, ErlangC_EW, ErlangC_EV, ErlangB, MMcKMZustandsP, ErwErlangC_PA, ErwErlangC, ErwErlangC_ENQ, ErwErlangC_EN, ErwErlangC_EW, ErwErlangC_EV}



/*
 * General helper functions
 */

/**
 * Calculates x^n/n! and avoids numerical problems
 * @param {Number} x x
 * @param {Number} n n (has to be an integer)
 * @returns x^n/n!
 */
function PotenzFakultaet(x,n) {
  if (n==0) return 1;
  let prod=1;
  for (let i=1;i<=n;i++) prod*=x/i;
  return prod;
}



/*
 * M/M/c system (Erlang C and extended Erlang C formula)
 */

/**
 * Calculates P0 for a M/M/c system
 * @param {Number} a Work load
 * @param {Number} c Number of agents (has to be a positive integer)
 * @returns Value P0
 */
function MMcZustandsP0(a,c) {
  let sum=0;
  for (let k=0;k<c;k++) sum+=PotenzFakultaet(a,k);
  sum+=PotenzFakultaet(a,c)*c/(c-a);

  if (sum>0) return 1/sum;
  return 0
}

/**
 * Calculates p_n for a M/M/c system
 * @param {Number} a Work load
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {Number} n Value n for which p_n is to be calculated
 * @returns Value p_n
 */
function MMcZustandsP(a,c,n) {
  if (n==0) return MMcZustandsP0(a,c);
  if (n<=c) return PotenzFakultaet(a,n)*MMcZustandsP0(a,c);
  return PotenzFakultaet(a,c)*Math.pow(a/c,n-c)*MMcZustandsP0(a,c);
}

/**
 * Calculates P1 for a M/M/c system
 * @param {Number} a Work load
 * @param {Number} c Number of agents (has to be a positive integer)
 * @returns Value P1
 */
function ErlangC_P1(a,c) {
  return PotenzFakultaet(a,c)*c/(c-a)*MMcZustandsP0(a,c);
}

/**
 * Calculates P2 for a M/M/c/K+M system
 * @param {Number} a Work load
 * @param {Number} bS Service batch size (has to be an integer)
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {Number} rho Utilization
 * @returns Value P2
 */
function ErlangC_P2(a,bS,c,rho) {
  const factor=PotenzFakultaet(a/bS,c)/(1-rho);
  let sum=0;
  for (let k=0;k<c;k++) sum+=PotenzFakultaet(a/bS,k);
  return factor/(factor+sum);
}

/**
 * Calculates P(W&gt;0) for a M/M/c system (this is the Erlang C formula)
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {*} t Waiting time
 * @returns Value P(W&gt;0)
 */
function ErlangC(lambda,mu,c,t) {
  const a=lambda/mu;
  if (a>=c) return 0;
  return 1-ErlangC_P1(a,c)*Math.exp(-(c-a)*mu*t);
}

/**
 * Calculates E[NQ], the average queue length, for a M/M/c system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} c Number of agents (has to be a positive integer)
 * @returns Value E[NQ]
 */
function ErlangC_ENQ(lambda,mu,c) {
  const a=lambda/mu;
  if (a>=c) return 0;
  return ErlangC_P1(a,c)*a/(c-a);
}

/**
 * Calculates E[N], the average number of customers in the system, for a M/M/c system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} c Number of agents (has to be a positive integer)
 * @returns Value E[N]
 */
function ErlangC_EN(lambda,mu,c) {
  const a=lambda/mu;
  if (a>=c) return 0;
  return ErlangC_P1(a,c)*a/(c-a)+a;
}

/**
 * Calculates E[W], the average waiting time, for a M/M/c system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} c Number of agents (has to be a positive integer)
 * @returns Value E[W]
 */
function ErlangC_EW(lambda,mu,c) {
  const a=lambda/mu;
  if (a>=c) return 0;
  return ErlangC_P1(a,c)/(c*mu-lambda);
}

/**
 * Calculates E[V], the average residence time, for a M/M/c system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} c Number of agents (has to be a positive integer)
 * @returns Value E[V]
 */
function ErlangC_EV(lambda,mu,c) {
  const a=lambda/mu;
  if (a>=c) return 0;
  return ErlangC_P1(a,c)/(c*mu-lambda)+1/mu;
}



/*
 * M/M/c/c system (Erlang B formula)
 */

/**
 * Calculates P1 for a M/M/c/c system (a queueing system with no waiting room; Erlang B formula)
 * @param {Number} a Work load
 * @param {Number} c Number of agents (has to be a positive integer)
 * @returns Value P1
 */
function ErlangB(a,c) {
  let sum=0;
  for (let n=0;n<=c;n++) sum+=PotenzFakultaet(a,n);
  return PotenzFakultaet(a,c)/sum;
}



/*
 * M/M/c/K+M system
 */

/**
 * Calculates C_n for a M/M/c/K+M system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} nu Cancelation rate
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {Number} n Value n for which C_n is to be calculated
 * @returns Value C_n
 */
function MMcKMCn(lambda,mu,nu,c,n) {
  const a=lambda/mu;
  if (n<=c) return PotenzFakultaet(a,n);
  let prod=PotenzFakultaet(a,c);
  for (let i=1;i<=n-c;i++) prod*=lambda/(c*mu+i*nu);
  return prod;
}

/**
 * Calculates p_n for a M/M/c/K+M system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} nu Cancelation rate
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {Number} K Maximum system size (has to be a positive integer larger or equal c)
 * @param {Number} n Value n for which p_n is to be calculated
 * @returns Value p_n
 */
function MMcKMZustandsP(lambda,mu,nu,c,K,n) {
  let p0=0;
  for (let i=0;i<=K;i++) p0+=MMcKMCn(lambda,mu,nu,c,i);
  p0=1/p0;

  if (n==0) return p0;
  if (n>K) return 0;
  return MMcKMCn(lambda,mu,nu,c,n)*p0;
}

/**
 * Calculates the cancelation probability P(A) for a M/M/c/K+M system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} nu Cancelation rate
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {Number} K Maximum system size (has to be a positive integer larger or equal c)
  * @returns Cancelation probability P(A)
 */
function ErwErlangC_PA(lambda,mu,nu,c,K) {
  const p0=MMcKMZustandsP(lambda,mu,nu,c,K,0);
  let sum=0;
  for (let n=c+1;n<=K;n++) sum+=nu/lambda*(n-c)*p0*MMcKMCn(lambda,mu,nu,c,n);
  return sum;
}

/**
 * Calculates the value of the log-gamma function
 * @param {Number} x Parameter
 * @returns Value of the log-gamma function
 */
function gammaln(x) {
  let j = 0;
  const cof = [
    76.18009172947146, -86.50532032941677, 24.01409824083091,
    -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5
  ];
  let ser = 1.000000000190015;
  let xx, y, tmp;
  tmp = (y = xx = x) + 5.5;
  tmp -= (xx + 0.5) * Math.log(tmp);
  for (; j < 6; j++)
    ser += cof[j] / ++y;
  return Math.log(2.5066282746310005 * ser / xx) - tmp;
};

/**
 * Calculates the value of the regularized incomplete gamma function P(a,x)
 * @param {Number} a Parameter a of P(a,x)
 * @param {Number} x Parameter x of P(a,x)
 * @returns Value of the regularized incomplete gamma function P(a,x)
 */
function lowRegGamma(a,x) {
  const aln = gammaln(a);
  let ap = a;
  let sum = 1 / a;
  let del = sum;
  let b = x + 1 - a;
  let c = 1 / 1.0e-30;
  let d = 1 / b;
  let h = d;
  let i = 1;
  const ITMAX = -~(Math.log((a >= 1) ? a : 1 / a) * 8.5 + a * 0.4 + 17); /* calculate maximum number of iterations required for a */
  let an;

  if (x < 0 || a <= 0) {
    return NaN;
  } else if (x < a + 1) {
    for (; i <= ITMAX; i++) {
      sum += del *= x / ++ap;
    }
    return (sum * Math.exp(-x + a * Math.log(x) - (aln)));
  }

  for (; i <= ITMAX; i++) {
    an = -i * (i - a);
    b += 2;
    d = an * d + b;
    c = b + an / c;
    d = 1 / d;
    h *= d * c;
  }

  return (1 - h * Math.exp(-x + a * Math.log(x) - (aln)));
};

/**
 * Calculates P(W&gt;0) for a M/M/c/K+M system (this is the extended Erlang C formula)
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} nu Cancelation rate
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {Number} K Maximum system size (has to be a positive integer larger or equal c)
 * @param {*} t Waiting time
 * @returns Value P(W&gt;0)
 */
function ErwErlangC(lambda,mu,nu,c,K,t) {
  const p0=MMcKMZustandsP(lambda,mu,nu,c,K,0);

  let p;
  if (p0==0) p=1; else p=1-p0*MMcKMCn(lambda,mu,nu,c,K);

  for (let n=c;n<K;n++) {
    const a=n-c+1;
    const x=(c*mu+nu)*t;
    const g=1-lowRegGamma(a,x);
    p-=p0*MMcKMCn(lambda,mu,nu,c,n)*g;
  }

  return p;
}

/**
 * Calculates E[NQ], the average queue length, for a M/M/c/K+M system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} nu Cancelation rate
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {Number} K Maximum system size (has to be a positive integer larger or equal c)
 * @returns Value E[NQ]
 */
function ErwErlangC_ENQ(lambda,mu,nu,c,K) {
    const p0=MMcKMZustandsP(lambda,mu,nu,c,K,0);
    let sum=0;
    for (let n=c+1;n<=K;n++) sum+=p0*(n-c)*MMcKMCn(lambda,mu,nu,c,n);
    return sum;
}

/**
 * Calculates E[N], the average number of customers in the system, for a M/M/c/K+M system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} nu Cancelation rate
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {Number} K Maximum system size (has to be a positive integer larger or equal c)
 * @returns Value E[N]
 */
function ErwErlangC_EN(lambda,mu,nu,c,K) {
  const p0=MMcKMZustandsP(lambda,mu,nu,c,K,0);
  let sum=0;
  for (let n=1;n<=K;n++) sum+=p0*n*MMcKMCn(lambda,mu,nu,c,n);
  return sum;
}

/**
 * Calculates E[W], the average waiting time, for a M/M/c/K+M system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} nu Cancelation rate
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {Number} K Maximum system size (has to be a positive integer larger or equal c)
 * @returns Value E[W]
 */
function ErwErlangC_EW(lambda,mu,nu,c,K) {
  return ErwErlangC_ENQ(lambda,mu,nu,c,K)/lambda;
}

/**
 * Calculates E[V], the average residence time, for a M/M/c/K+M system
 * @param {Number} lambda Arrival rate
 * @param {Number} mu Service rate (has to be &gt;0)
 * @param {Number} nu Cancelation rate
 * @param {Number} c Number of agents (has to be a positive integer)
 * @param {Number} K Maximum system size (has to be a positive integer larger or equal c)
 * @returns Value E[V]
 */
function  ErwErlangC_EV(lambda,mu,nu,c,K) {
  return ErwErlangC_EN(lambda,mu,nu,c,K)/lambda;
}

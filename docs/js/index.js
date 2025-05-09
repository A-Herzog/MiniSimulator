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

export {selectLanguage, rewriteLinksInOfflineMode, initModel, resetModel, toggleExplanations, runFull, runLog, cleanOutput, terminateSimulation}

import {callcenter} from "./Callcenter.js";
import {statcore} from './StatCore.js';
import {ErlangC_P2, ErlangC_ENQ, ErlangC_EN, ErlangC_EW, ErlangC_EV, ErwErlangC_ENQ, ErwErlangC_EN, ErwErlangC_EW, ErwErlangC_EV} from './Erlang.js';

/* Sprachauswahl */

function selectLanguageFile(file) {
  if (window.location.href.endsWith(file)) return false;
  window.location.href='./'+file;
  return true;
}

function selectLanguage(languages) {
  let selectedLanguage=localStorage.getItem('selectedLanguage');

  if (selectedLanguage==null) {
    const userLang=(navigator.language || navigator.userLanguage).toLocaleLowerCase();
    let preferredFile=languages.find(language=>language.name=='default').file;
    for (let language of languages) if (userLang.startsWith(language.name)) {preferredFile=language.file; break;}
    return selectLanguageFile(preferredFile);
  } else {
    return selectLanguageFile(languages.find(language=>language.name==selectedLanguage).file);
  }
}

/* Umschreiben der Links für den Offline-Modus */

function rewriteLinksInOfflineMode() {
  if (!isDesktopApp) return;
  for (let link of document.querySelectorAll("a")) if (link.href.startsWith('https://')) {
    const href=link.href;
    link.onclick=()=>Neutralino.os.open(href);
    link.removeAttribute("href");
    link.style.cursor="pointer";
    if (!link.classList.contains("dropdown-item") && !link.classList.contains("btn")) link.classList.add("link-primary");
  }
}

/* Simulationssystem */

let worker=[];

let multiCoreArrivalsDone=[];
let multiCorePartialResults=[];

function initModel() {
  resetModel(false);

  /* Warteraumgröße */
  document.getElementById('hasWaitingRoomSize').addEventListener('click',()=>updateGUI());

  /* Wartezeittoleranz */
  document.getElementById('hasImpatience').addEventListener('click',()=>updateGUI());

  updateGUI();
}

function resetModel(showConfirm, modelType=1) {
  if (showConfirm) {
    if (!confirm(language.GUI.resetSettings)) return;
  }

  let arrivalProcess;
  let serviceProcess;
  let agents;

  switch (modelType) {
    case 0: /* M/D/1 */
      arrivalProcess=[1,100,100];
      agents=1;
      serviceProcess=[0,80,40];
      break;
    case 1: /* M/M/1 */
      arrivalProcess=[1,100,100];
      agents=1;
      serviceProcess=[1,80,40];
      break;
    case 2: /* M/M/5 */
      arrivalProcess=[1,100,100];
      agents=5;
      serviceProcess=[1,5*80,5*40];
      break;
    case 3: /* M/G/5 */
      arrivalProcess=[1,100,100];
      agents=5;
      serviceProcess=[2,5*80,5*40];
      break;
  }

  /* Ankünfte */
  document.getElementById('batchArrival').value=1;
  document.getElementById('interArrivalTimesDistribution').value=arrivalProcess[0];
  document.getElementById('interArrivalTimesDistributionMean').value=arrivalProcess[1];
  document.getElementById('interArrivalTimesDistributionSD').value=arrivalProcess[2];

  /* Warteraum */
  document.getElementById('hasWaitingRoomSize').checked=false;
  document.getElementById('waitingRoomSize').value=1000000;
  document.getElementById('hasImpatience').checked=false;
  document.getElementById('waitingTimeToleranceDistribution').value=0;
  document.getElementById('waitingTimeToleranceDistributionMean').value=8640000;
  document.getElementById('waitingTimeToleranceDistributionSD').value=1000;
  document.getElementById('retryProbability').value=0;
  document.getElementById('retryDistribution').value=1;
  document.getElementById('retryDistributionMean').value=1800;
  document.getElementById('retryDistributionSD').value=1800;

  /* Bedienung */
  document.getElementById('queueingDiscipline').value=0;
  document.getElementById('agents').value=agents;
  document.getElementById('batchService').value=1;
  document.getElementById('serviceTimesDistribution').value=serviceProcess[0];
  document.getElementById('serviceTimesDistributionMean').value=serviceProcess[1];
  document.getElementById('serviceTimesDistributionSD').value=serviceProcess[2];
  document.getElementById('postProcessingTimesDistribution').value=0;
  document.getElementById('postProcessingTimesDistributionMean').value=0;
  document.getElementById('postProcessingTimesDistributionSD').value=100;
  document.getElementById('forwardingProbability').value=0;

  /* Simulation */
  document.getElementById('arrivalCount').value=1000000;
  document.getElementById('arrivalCountWarmUp').value=10000;

  updateGUI();
}

function toggleExplanations() {
  const isVisible=document.querySelector('.cardInfo').style.display!='none';

  if (isVisible) {
    for (let element of document.querySelectorAll('.cardInfo')) element.style.display="none";
    document.getElementById('toggleExplanationsButton').innerHTML=language.GUI.explanationsShow;
  } else {
    for (let element of document.querySelectorAll('.cardInfo')) element.style.display="";
    document.getElementById('toggleExplanationsButton').innerHTML=language.GUI.explanationsHide;
  }
}

function setInputEnableState(id,enabled) {
  const input=document.getElementById(id);
  if (enabled) input.removeAttribute('disabled'); else input.setAttribute('disabled','disabled');
}

function updateGUI() {
  /* Warteraumgröße */
  const hasWaitingRoomSize=document.getElementById('hasWaitingRoomSize').checked;
  setInputEnableState('waitingRoomSize',hasWaitingRoomSize);

  /* Wartezeittoleranz */
  const hasImpatience=document.getElementById('hasImpatience').checked;
  setInputEnableState('waitingTimeToleranceDistribution',hasImpatience);
  setInputEnableState('waitingTimeToleranceDistributionMean',hasImpatience);
  setInputEnableState('waitingTimeToleranceDistributionSD',hasImpatience);
}

function cleanOutput() {
  document.getElementById('output').innerHTML='';
}

function setSimulationRunning(running) {
  document.getElementById('buttonRunFull').style.display=(running?"none":"");
  document.getElementById('buttonRunLog').style.display=(running?"none":"");
  document.getElementById('buttonClear').style.display=(running?"none":"");
  if (!running) {
    document.getElementById('buttonTerminate').style.display="none";
    document.getElementById('progress').style.display="none";
  }
}

function terminateSimulation() {
  for (let i=0;i<worker.length;i++) worker[i].terminate();
  setSimulationRunning(false);
}

function showProgress(part) {
  const progressBar=document.getElementById('progressBar');
  const info=Math.round(100*part)+"%";
  progressBar.style.width=info;
  progressBar.innerHTML=info;
}

function getWebWorker() {
  return new Worker('./js/Worker.js',{type: "module"});
}

function runFull() {
  const model=loadData(true);
  if (model==null) return;

  setSimulationRunning(true);
  cleanOutput();

  let path=window.location.href;
  if (path.endsWith(".html")) path=path.substring(0,path.lastIndexOf("/")+1);
  if (!path.endsWith("/")) path+="/";

  const progress=document.getElementById('progress');
  const progressBar=document.getElementById('progressBar');
  progressBar.style.width="0%";
  progressBar.innerHTML="0%";
  progress.style.display="";
  document.getElementById('buttonTerminate').style.display="";
  window.scrollTo(0,document.getElementById('outputOuter').getBoundingClientRect().top+window.scrollY-100);

  const coreCount=navigator.hardwareConcurrency;

  worker=[];
  let workerModel;
  if (document.getElementById('useMultiCore').checked) {
	  for (let i=0;i<coreCount;i++) worker.push(getWebWorker());
    workerModel=runFullMultiCore(model,coreCount);
  } else {
	  worker.push(getWebWorker());
    workerModel=runFullSingleCore(model);
  }

  setTimeout(function(){
    for (let i=0;i<worker.length;i++) worker[i].postMessage({path: path, index: i, model: workerModel[i], language: language});
  },10);
}

function runFullSingleCore(model) {
  worker[0].onmessage=function(e) {
    const result=e.data;
    if (result.mode=="Status") {
	  showProgress(result.arrivals/model.arrivalCount);
    }
    if (result.mode=="Result") {
	    document.getElementById('output').innerHTML=buildStatisticText(result.statistics,result.arrivals,result.events,result.time,1,model);
      worker[0].terminate();
      setSimulationRunning(false);
    }
  }
  return [model];
}

function runFullMultiCore(model,threadCount) {
  /* Teilmodelle erstellen */
  const workerModel=[];
  const original=JSON.stringify(model);
  let arrivalDone=0;
  for (let i=0;i<threadCount;i++) {
    let m=JSON.parse(original);
	m.arrivalCount=Math.floor(model.arrivalCount/threadCount);
	arrivalDone+=m.arrivalCount;
	workerModel.push(m);
  }
  workerModel[threadCount-1].arrivalCount+=(model.arrivalCount-arrivalDone);

  /* Fortschrittserfassung initialisieren */
  multiCoreArrivalsDone=[];
  for (let i=0;i<threadCount;i++) multiCoreArrivalsDone.push(0);
  multiCorePartialResults=[];

  /* Callbacks für Worker */
  for (let i=0;i<threadCount;i++) worker[i].onmessage=function(e) {
    const result=e.data;
	const index=result.index;
    if (result.mode=="Status") {
	  multiCoreArrivalsDone[index]=result.arrivals;
	  let sum=0.0;
	  for (let i=0;i<threadCount;i++) sum+=multiCoreArrivalsDone[i];
	  showProgress(sum/model.arrivalCount);
    }
    if (result.mode=="Result") {
	  multiCorePartialResults.push({statistics: result.statistics, arrivals: result.arrivals, events: result.events, time: result.time});
	  if (multiCorePartialResults.length==threadCount) {
	    document.getElementById('output').innerHTML=buildMultiCoreStatisticText(model);
      for (let i=0;i<worker.length;i++) worker[i].terminate();
		  setSimulationRunning(false);
	  }
    }
  }

  return workerModel;
}

function buildMultiCoreStatisticText(model) {
  let arrivals=0;
  let events=0;
  let time=0;
  const statistics=new callcenter.Statistics();

  for (let i=0;i<multiCorePartialResults.length;i++) {
	arrivals+=multiCorePartialResults[i].arrivals;
	events+=multiCorePartialResults[i].events;
	time=Math.max(time,multiCorePartialResults[i].time);
	statistics.addPartial(multiCorePartialResults[i].statistics);
  }

  return buildStatisticText(statistics.makePlain(),arrivals,events,time,multiCorePartialResults.length,model);
}

function buildStatisticTextTimes(name,id,indicator) {
  let info="";
  info+="<p>";
  info+=name+"<br>";
  info+=language.statistics.mean+": <tt>E["+id+"]="+statcore.formatShorter(indicator.mean)+"</tt><br>";
  info+=language.statistics.variation+": <tt>SD["+id+"]="+statcore.formatShorter(indicator.sd)+"</tt>, <tt>CV["+id+"]="+statcore.formatShorter(indicator.cv)+"</tt><br>";
  info+=language.statistics.range+": <tt>Min["+id+"]="+statcore.formatShorter(indicator.min)+"</tt>, <tt>Max["+id+"]="+statcore.formatShorter(indicator.max)+"</tt>";
  info+="</p>";
  return info;
}

function buildStatisticText(statistics,arrivals,events,time,threads,model) {
  let info="";

  /* Anzahl an Kunden (im System / in der Warteschlange) */

  info+="<h5>"+language.statistics.queue+"</h5>";
  info+="<p>";
  info+=language.statistics.queueAverage+": <tt>E[N<sub>Q</sub>]="+statcore.formatShorter(statistics.NQ.mean)+"</tt><br>";
  info+=language.statistics.range+": <tt>Min[N<sub>Q</sub>]="+statcore.formatShorter(statistics.NQ.min)+"</tt>, <tt>Max[N<sub>Q</sub>]="+statcore.formatShorter(statistics.NQ.max)+"</tt>";
  info+="</p>";

  info+="<h5>"+language.statistics.numberOfClientsInSystem+"</h5>";
  info+="<p>";
  info+=language.statistics.numberOfClientsInSystemAverage+": <tt>E[N]="+statcore.formatShorter(statistics.N.mean)+"</tt><br>";
  info+=language.statistics.range+": <tt>Min[N]="+statcore.formatShorter(statistics.N.min)+"</tt>, <tt>Max[N]="+statcore.formatShorter(statistics.N.max)+"</tt>";
  info+="</p>";

  info+="<h5>"+language.statistics.numberOfCallers+"</h5>";
  info+="<p>";
  info+=language.statistics.numberOfCallersFreshCalls+": "+statistics["Fresh calls"].count;
  if (statistics["Retry calls"].count>0) info+="<br>"+language.statistics.numberOfCallersRetryers+": "+statistics["Retry calls"].count;
  if (statistics["Forward calls"].count>0) info+="<br>"+language.statistics.numberOfCallersForwardings+": "+statistics["Forward calls"].count;
  if (statistics["Canceled calls"].count>0) {
    info+="<br>"+language.statistics.numberOfCallersSuccessfulCalls+": "+statistics["Successful calls"].count;
    info+="<br>"+language.statistics.numberOfCallersCanceledCalls+": "+statistics["Canceled calls"].count;
  }
  info+="</p>";

  /* Zeitdauern */

  info+="<h5>"+language.statistics.times+"</h5>";
  info+=buildStatisticTextTimes(language.statistics.interArrivalTimes,"I",statistics["Inter-arrival"]);
  info+=buildStatisticTextTimes(language.statistics.interLeaveTimes,"IL",statistics["Inter-leave"]);
  if (statistics["Canceled calls"].count>0) {
    info+=buildStatisticTextTimes(language.statistics.waitingTimesSuccess,"W",statistics.Wsuccess);
	info+=buildStatisticTextTimes(language.statistics.waitingTimesCancel,"A",statistics.Wcancel);
	info+=buildStatisticTextTimes(language.statistics.waitingTimesAll,"W",statistics.W);
  } else {
	info+=buildStatisticTextTimes(language.statistics.waitingTimes,"W",statistics.W);
  }
  info+=buildStatisticTextTimes(language.statistics.serviceTimes,"S",statistics.S);
  if (statistics["S2"].max>0) {
    info+=buildStatisticTextTimes(language.statistics.postprocessingTimes,"S2",statistics["S2"]);
  }
  info+=buildStatisticTextTimes(language.statistics.residenceTimes,"V",statistics.V);
  info+="</p>";

  /* Auslastung */

  info+="<h5>"+language.statistics.operators+"</h5>";
  info+="<p>";
  info+=language.statistics.operatorsAverageBusy+": <tt>"+statcore.formatShorter(statistics["Agents busy"].mean)+"</tt><br>";
  info+=language.statistics.workload+" <tt>&rho;="+statcore.formatShorter(100*statistics["Agents busy"].mean/model.agents)+"%</tt>";
  info+="</p>";

  /* Simulationssystem */

  info+="<h5>"+language.statistics.simulationSystem+"</h5>";
  info+="<p>";
  info+=language.statistics.numberOfCallersFreshCalls+": "+statcore.formatShorter(arrivals)+"<br>";
  info+=language.statistics.simulationSystemSimulatedEvents+": "+statcore.formatShorter(events)+"<br>";
  info+=language.statistics.simulationSystemNeededTime+": "+statcore.formatShorter(time/1000)+" Sekunden<br>";
  info+=language.statistics.simulationSystemUsedThreads+": "+threads;
  info+="</p>";

  info+=buildErlangText(model,statistics);

  info+="<p><small>"+language.statistics.decimalSeparatorInfo+"</small></p>";

  return info;
}

function buildErlangText(model,statistics) {
  /* Ankünfte */
  const arrivalDistribution=splitDistribution(model.interArrivalTimesDistribution);
  const lambda=1.0/arrivalDistribution[1];
  const scvI=Math.pow(arrivalDistribution[2],2)/Math.pow(arrivalDistribution[1],2);
  const arrivalIsExp=arrivalDistribution[0]==1;
  const hasBatchArrival=(model.batchArrival>1);
  const hasImpatience=model.hasImpatience;
  const hasRetry=(model.retryProbability>0);
  let nu=0;
  let waitingTimeToleranceIsExp=true;
  let K=10000;
  if (hasImpatience) {
    const waitingTimeToleranceDistribution=splitDistribution(model.waitingTimeToleranceDistribution);
    nu=1.0/waitingTimeToleranceDistribution[1];
    waitingTimeToleranceIsExp=waitingTimeToleranceDistribution[0]==1;
    K=Math.min(10000,model.waitingRoomSize);
  }

  /* Bedienprozess */
  const c=model.agents;
  const serviceDistribution=splitDistribution(model.serviceTimesDistribution);
  const mu=1.0/serviceDistribution[1];
  const scvS=Math.pow(serviceDistribution[2],2)/Math.pow(serviceDistribution[1],2);
  const serviceIsExp=serviceDistribution[0]==1;
  const hasBatchService=(model.batchService>1);
  const hasForwarding=(model.forwardingProbability>0);
  const hasPostProcessing=(model.postProcessingTimesDistribution!="const(0)");

  let info="";
  let formula;
  let reasons=[];

  let ENQ, EN, EW, EV;
  if ((arrivalIsExp && serviceIsExp && model.batchArrival==1 && model.batchService==1) || hasImpatience) {
    if (!arrivalIsExp) reasons.push(language.statistics.compareReasonsInterArrivalIsNotExp);
    if (!serviceIsExp) reasons.push(language.statistics.compareReasonsInterServiceIsNotExp);
    if (hasBatchArrival) reasons.push(language.statistics.compareReasonsArrivalBatch);
    if (!waitingTimeToleranceIsExp) reasons.push(language.statistics.compareReasonsWaitingTimeTolerancesNotExp);
    if (hasBatchService) reasons.push(language.statistics.compareReasonsServiceBatch);
    if (hasRetry) reasons.push(language.statistics.compareReasonsRetry);
    const lambdaReal=lambda*model.batchArrival;
    const muReal=mu*model.batchService;
    if (hasImpatience) {
      /* Erweiterte Erlang-C-Formel */
      formula=language.statistics.compareFormulaExtErlangC;
      ENQ=ErwErlangC_ENQ(lambdaReal,muReal,nu,c,K);
      EN=ErwErlangC_EN(lambdaReal,muReal,nu,c,K);
      EW=ErwErlangC_EW(lambdaReal,muReal,nu,c,K);
      EV=ErwErlangC_EV(lambdaReal,muReal,nu,c,K);
    } else {
      /* Erlang-C */
      formula=language.statistics.compareFormulaErlangC;
      ENQ=ErlangC_ENQ(lambdaReal,muReal,c);
      EN=ErlangC_EN(lambdaReal,muReal,c);
      EW=ErlangC_EW(lambdaReal,muReal,c);
      EV=ErlangC_EV(lambdaReal,muReal,c);
    }
    info+="<h5>"+language.statistics.compareValuesErlangC+"</h5>";
  } else {
    /* Allen-Cunneen */
    formula=language.statistics.compareFormulaAC;
    const a=model.batchArrival*lambda/(model.batchService*mu);
    const rho=Math.min(a/c,0.999);
    const rhoFactor=rho/(1-rho);
    const P2=ErlangC_P2(lambda/mu,model.batchService,c,rho);
    const scvFactor=(model.batchArrival*scvI+model.batchService*scvS)/2;
    const batch=(model.batchArrival-1)/2+(model.batchService-1)/2;
    ENQ=rhoFactor*P2*scvFactor+batch;
    EN=ENQ+a;
    EW=ENQ*1/(lambda*model.batchArrival);
    EV=ENQ*1/(lambda*model.batchArrival)+1/mu;
    info+="<h5>"+language.statistics.compareValuesAC+"</h5>";
  }
  if (hasForwarding) reasons.push(language.statistics.compareReasonsForwarding);
  if (hasPostProcessing) reasons.push(language.statistics.compareReasonsPostProcessing);

  info+="<p>";
  info+=language.statistics.queueAverage+": <tt>E[N<sub>Q</sub>]="+statcore.formatShorter(ENQ)+"</tt> <small>("+language.statistics.compareRelativeDifference+": "+statcore.formatShorter(100.0*(ENQ-statistics.NQ.mean)/statistics.NQ.mean)+"%)</small><br>";
  info+=language.statistics.numberOfClientsInSystemAverage+": <tt>E[N]="+statcore.formatShorter(EN)+"</tt> <small>("+language.statistics.compareRelativeDifference+": "+statcore.formatShorter(100.0*(EN-statistics.N.mean)/statistics.N.mean)+"%)</small><br>";
  info+=language.statistics.waitingTimesAll+": <tt>E[W]="+statcore.formatShorter(EW)+"</tt> <small>("+language.statistics.compareRelativeDifference+": "+statcore.formatShorter(100.0*(EW-statistics.W.mean)/statistics.W.mean)+"%)</small><br>";
  info+=language.statistics.residenceTimes+": <tt>E[V]="+statcore.formatShorter(EV)+"</tt> <small>("+language.statistics.compareRelativeDifference+": "+statcore.formatShorter(100.0*(EV-statistics.V.mean)/statistics.V.mean)+"%)</small><br>";
  info+="</p>";

  if (reasons.length==0) {
    info+="<p>";
    info+=language.statistics.compareInfoOk1+formula+language.statistics.compareInfoOk2;
    info+="</p>";
  } else {
    info+="<p>";
    info+=language.statistics.compareReasonsHeading;
    info+="</p>";
    info+="<ul>";
    for (let i=0;i<reasons.length;i++) info+="<li>"+reasons[i]+"</li>";
    info+="</ul>";
  }

  return info;
}

function runLog() {
  const model=loadData(false);
  if (model==null) return;

  setSimulationRunning(true);
  cleanOutput();

  callcenter.initModel(model);
  let log="";
  const simulator=new callcenter.Simulator(model,function(s){log+=s+"<br>\n";},language);
  while (simulator.executeNext());

  document.getElementById('output').innerHTML="<small><tt>"+log+"</tt></small>";
  window.scrollTo(0,document.getElementById('outputOuter').getBoundingClientRect().top+window.scrollY-100);
  setSimulationRunning(false);
}

function getOption(id) {
  return document.getElementById(id).value;
}

function parseFloatStrict(value) {
    if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      .test(value))
      return Number(value);
  return NaN;
}

function getFloat(id) {
  let s=document.getElementById(id).value;
  if (typeof(s.replaceAll)=='function') s=s.replaceAll(",",".");
  const num=parseFloatStrict(s);
  if (isNaN(num)) return null;
  return num;
}

function parseIntStrict(value) {
  if(/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
    return Number(value);
  return NaN;
}

function getInt(id) {
  const num=parseIntStrict(document.getElementById(id).value);
  if (isNaN(num)) return null;
  return num;
}

function getChecked(id) {
  return document.getElementById(id).checked;
}

function buildDistribution(selectNr, mean, sd) {
  switch (parseInt(selectNr)) {
    case 0: return "const("+mean+")";
    case 1: return "exp("+mean+")";
    case 2: return "lognormal("+mean+";"+sd+")";
    case 3: return "gamma("+mean+";"+sd+")";
    default: return "const(1)";
  }
}

function splitDistribution(distribution) {
  const index1=distribution.indexOf("(");
  const index2=distribution.indexOf(")");
  if (index1<0 || index2<0) return [0,1];
  const name=distribution.substring(0,index1);
  const params=distribution.substring(index1+1,index2);

  let type=0;
  if (name=="const") type=0;
  if (name=="exp") type=1;
  if (name=="lognormal") type=2;
  if (name=="gamma") type=3;

  let arr=params.split(";");

  let result=[type];
  for (let i=0;i<arr.length;i++) result.push(parseFloat(arr[i]));
  if (result.length==2) switch (type) {
    case 0: result.push(0); break;
    case 1: result.push(arr[0]); break;
  }
  return result;
}

function showError(id,title,content) {
  const popover = new bootstrap.Popover(document.getElementById(id),{title: title, content: content, trigger: "manual", placement: "bottom"});
  popover.show();
  setTimeout(()=>popover.hide(),5000);
  window.scrollTo(0,document.getElementById(id).getBoundingClientRect().top+window.scrollY-100);
}

function loadData(fullSimulation) {
  const model=new callcenter.Model();

  /* Ankünfte */

  const interArrivalTimesDistribution=getOption('interArrivalTimesDistribution');
  const interArrivalTimesDistributionMean=getFloat('interArrivalTimesDistributionMean');
  const interArrivalTimesDistributionSD=getFloat('interArrivalTimesDistributionSD');
  const batchArrival=getInt('batchArrival');

  if (interArrivalTimesDistributionMean==null || interArrivalTimesDistributionMean<=0) {
    showError('interArrivalTimesDistributionMean',language.model.averageInterArrivalTime,language.model.errorPositiveNumber);
	return null;
  }
  if (interArrivalTimesDistribution>=2 && interArrivalTimesDistributionSD==null || interArrivalTimesDistributionSD<0) {
    showError('interArrivalTimesDistributionSD',language.model.stdDevInterArrivalTime,language.model.errorNonNegativeNumber);
	return null;
  }
  if (batchArrival==null || batchArrival<1) {
   showError('batchArrival',language.model.arrivalBatchSize,language.model.errorPositiveInteger);
   return null;
  }

  model.interArrivalTimesDistribution=buildDistribution(interArrivalTimesDistribution,interArrivalTimesDistributionMean,interArrivalTimesDistributionSD);
  model.batchArrival=batchArrival;

  /* Warteraum */

  const hasWaitingRoomSize=getChecked('hasWaitingRoomSize');
  const waitingRoomSize=getInt('waitingRoomSize');
  const hasImpatience=getChecked('hasImpatience');
  const waitingTimeToleranceDistribution=getOption('waitingTimeToleranceDistribution');
  const waitingTimeToleranceDistributionMean=getFloat('waitingTimeToleranceDistributionMean');
  const waitingTimeToleranceDistributionSD=getFloat('waitingTimeToleranceDistributionSD');
  const retryProbability=getFloat('retryProbability');
  const retryDistribution=getOption('retryDistribution');
  const retryDistributionMean=getFloat('retryDistributionMean');
  const retryDistributionSD=getFloat('retryDistributionSD');

  if (hasWaitingRoomSize) {
    if (waitingRoomSize==null || waitingRoomSize<0) {
     showError('waitingRoomSize',language.model.waitingRoomSize,language.model.errorNonNegativeInteger);
     return null;
    }
  }
  if (hasImpatience) {
    if (waitingTimeToleranceDistributionMean==null || waitingTimeToleranceDistributionMean<=0) {
      showError('waitingTimeToleranceDistributionMean',language.model.averageWaitingTimeTolerance,language.model.errorPositiveNumber);
	  return null;
    }
    if (waitingTimeToleranceDistribution==2 && waitingTimeToleranceDistributionSD==null || waitingTimeToleranceDistributionSD<0) {
      showError('waitingTimeToleranceDistributionSD',language.model.stdDevWaitingTimeTolerance,language.model.errorNonNegativeNumber);
	  return null;
    }
  }
  if (retryProbability==null || retryProbability<0 || retryProbability>1) {
	showError('retryProbability',language.model.retryProbability,language.model.errorProbability);
	return null;
  }
  if (retryDistributionMean==null || retryDistributionMean<=0) {
    showError('retryDistributionMean',language.model.averageRetryTime,language.model.errorPositiveNumber);
	return null;
  }
  if (retryDistribution==2 && retryDistributionSD==null || retryDistributionSD<0) {
    showError('retryDistributionSD',language.model.stdDevRetryTime,language.model.errorNonNegativeNumber);
	return null;
  }

  model.hasWaitingRoomSize=hasWaitingRoomSize;
  if (hasWaitingRoomSize) {
    model.waitingRoomSize=waitingRoomSize;
  } else {
    model.waitingRoomSize=1000000000;
  }
  model.hasImpatience=hasImpatience;
  if (hasImpatience) {
    model.waitingTimeToleranceDistribution=buildDistribution(waitingTimeToleranceDistribution,waitingTimeToleranceDistributionMean,waitingTimeToleranceDistributionSD);
  } else {
    model.waitingTimeToleranceDistribution="const(1000000000)";
  }
  model.retryProbability=retryProbability;
  model.retryDistribution=buildDistribution(retryDistribution,retryDistributionMean,retryDistributionSD);

  /* Bedienung */

  const agents=getInt('agents');
  const queueingDiscipline=getInt('queueingDiscipline');
  const serviceTimesDistribution=getOption('serviceTimesDistribution');
  const serviceTimesDistributionMean=getFloat('serviceTimesDistributionMean');
  const serviceTimesDistributionSD=getFloat('serviceTimesDistributionSD');
  const batchService=getInt('batchService');
  const postProcessingTimesDistribution=getOption('postProcessingTimesDistribution');
  const postProcessingTimesDistributionMean=getFloat('postProcessingTimesDistributionMean');
  const postProcessingTimesDistributionSD=getFloat('postProcessingTimesDistributionSD');
  const forwardingProbability=getFloat('forwardingProbability');

  if (agents==null || agents<0) {
   showError('agents',language.model.numberOfOperators,language.model.errorPositiveInteger);
   return null;
  }
  if (serviceTimesDistributionMean==null || serviceTimesDistributionMean<=0) {
    showError('serviceTimesDistributionMean',language.model.averageServiceTime,language.model.errorPositiveNumber);
	return null;
  }
  if (serviceTimesDistribution==2 && serviceTimesDistributionSD==null || serviceTimesDistributionSD<0) {
    showError('serviceTimesDistributionSD',language.model.stdDevServiceTime,language.model.errorNonNegativeNumber);
	return null;
  }
  if (batchService==null || batchService<1) {
   showError('batchService',language.model.serviceBatchSize,language.model.errorPositiveInteger);
   return null;
  }
  if (postProcessingTimesDistributionMean==null || postProcessingTimesDistributionMean<0) {
    showError('postProcessingTimesDistributionMean',language.model.averagePostProcessingTime,language.model.errorNonNegativeNumber);
	return null;
  }
  if (postProcessingTimesDistribution==2 && postProcessingTimesDistributionSD==null || postProcessingTimesDistributionSD<0) {
    showError('postProcessingTimesDistributionSD',language.model.stdDevPostProcessingTime,language.model.errorNonNegativeNumber);
	return null;
  }
  if (forwardingProbability==null || forwardingProbability<0 || forwardingProbability>1) {
	showError('forwardingProbability',language.model.forwardingProbability,language.model.errorProbability);
	return null;
  }

  model.agents=agents;
  model.queueingDiscipline=queueingDiscipline;
  model.serviceTimesDistribution=buildDistribution(serviceTimesDistribution,serviceTimesDistributionMean,serviceTimesDistributionSD);
  model.batchService=batchService;
  model.postProcessingTimesDistribution=buildDistribution(postProcessingTimesDistribution,postProcessingTimesDistributionMean,postProcessingTimesDistributionSD);
  model.forwardingProbability=forwardingProbability;

  /* Simulation */

  if (fullSimulation) {
    const arrivalCount=getInt('arrivalCount');
    const arrivalCountWarmUp=getInt('arrivalCountWarmUp');
	if (arrivalCount==null || arrivalCount<=0) {
	  showError('arrivalCount',language.model.numberOfArrivals,language.model.errorPositiveInteger);
	  return null;
	}
	if (arrivalCountWarmUp==null || arrivalCountWarmUp<0) {
	  showError('arrivalCountWarmUp',language.model.warmUpPhase,language.model.errorNonNegativeInteger);
	  return null;
	}
	model.arrivalCount=arrivalCount;
    model.arrivalCountWarmUp=arrivalCountWarmUp;
  } else {
    model.arrivalCount=100;
    model.arrivalCountWarmUp=0;
  }

  return model;
}
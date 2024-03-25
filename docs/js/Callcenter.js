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

export{callcenter}

import {distcore} from './DistCore.js';
import {statcore} from './StatCore.js';
import {simcore} from './SimCore.js';

const callcenter={};





/**
 * Static model data for the call center model
 */
callcenter.Model=class Model {
  constructor() {
    /* Arrival count */
    this.arrivalCount=1000000;
    /* Additional arrivals before statistics recording starts */
    this.arrivalCountWarmUp=0;
    /* Inter-arrival time distribution */
    this.interArrivalTimesDistribution="exp(100)";
    /* Arriving clients per arrival event */
    this.batchArrival=1;
	  /* Is the waiting room size limited? */
	  this.hasWaitingRoomSize=true;
    /* Waiting room size (clients being served do not require waiting room space) */
    this.waitingRoomSize=1000000;
	  /* Is the waiting time tolerance to be used? */
	  this.hasImpatience=true;
    /* Waiting time tolerance distribution */
    this.waitingTimeToleranceDistribution=86400*365*100;
    /* Serving batch size */
    this.batchService=1;
    /* Number of operators in the system */
    this.agents=1;
	  /* FIFO=0, Random=1, LIFO=2, SJF=3, LJF=4 */
	  this.queueingDiscipline=0;
    /* Service time distribution (callback function generating a random number) */
    this.serviceTimesDistribution="exp(80)";
    /* Post processing time distribution*/
    this.postProcessingTimesDistribution=0;
    /* Probability of forwarding a client after service */
    this.forwardingProbability=0;
    /* Retry probability after blocking a client or after a waiting time cancelation */
    this.retryProbability=0;
    /* Retry time distribution (callback function generating a random number) */
    this.retryDistribution="exp(1800)";
  }
}





/**
 * Parses the distribution strings in a call center model and generates callback functions
 */
callcenter.initModel=function(model) {
 model.interArrivalTimesDistribution=distcore.get(model.interArrivalTimesDistribution);
 model.waitingTimeToleranceDistribution=distcore.get(model.waitingTimeToleranceDistribution);
 model.serviceTimesDistribution=distcore.get(model.serviceTimesDistribution);
 model.postProcessingTimesDistribution=distcore.get(model.postProcessingTimesDistribution);
 model.retryDistribution=distcore.get(model.retryDistribution);
}





/**
 * Dynamic model data for the call center model
 */
class CallcenterData {
  constructor(model) {
    this.arrivalCount=0;
    this.freeAgents=model.agents;
    this.isWarmUpPeriod=true;
    this.queue=[];
    this.clientsInServiceProcess=0;
  }
}





/**
 * Statistics
 */
callcenter.Statistics=class Statistics extends statcore.Statistics {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.add("Fresh calls",this.callsFresh=new statcore.Counter());
    this.add("Retry calls",this.callsRetry=new statcore.Counter());
    this.add("Forward calls",this.callsForward=new statcore.Counter());
    this.add("Successful calls",this.callsSuccess=new statcore.Counter());
    this.add("Canceled calls",this.callsCancel=new statcore.Counter());

    this.add("Inter-arrival",this.I=new statcore.Values());
    this.add("Inter-leave",this.IL=new statcore.Values());
    this.add("W",this.W=new statcore.Values());
    this.add("Wsuccess",this.Wsuccess=new statcore.Values());
    this.add("Wcancel",this.Wcancel=new statcore.Values());
    this.add("S",this.S=new statcore.Values());
    this.add("S2",this.S2=new statcore.Values());
    this.add("V",this.V=new statcore.Values());

    this.add("N",this.N=new statcore.States());
    this.add("NQ",this.NQ=new statcore.States());
    this.add("Agents free",this.agentsFree=new statcore.States());
    this.add("Agents busy",this.agentsBusy=new statcore.States());

    this.lastArrival=0;
    this.lastLeave=0;
  }

  /**
   * Records a client entering the system.
   * @param {Number} time  Current time
   * @param {Boolean} isFreshCall Is the call a fresh call (true) or a retry (false)?
   */
  logArrival(time,isFreshCall) {
    this.I.add(time-this.lastArrival);
    this.lastArrival=time;

    if (isFreshCall) this.callsFresh.add(); else this.callsRetry.add();
  }

  /**
   * Records a client leaving the system.
   * @param {Number} time Current time
   * @param {Boolean} success Was the call successful (true) or was it a call cancelation (false)?
   */
  logLeave(time,success) {
    this.IL.add(time-this.lastLeave);
    this.lastLeave=time;

    if (success) this.callsSuccess.add(); else this.callsCancel.add();
  }

  /**
   * Records waiting and/or serivce times of a client.
   * @param {Object} client  Client from which the data is to be recorded.
   * @param {Boolean} success Was the call successful (true) or was it a call cancelation (false)?
   */
  logClientService(client,success) {
    this.W.add(client.waitingTime);
    if (success) this.Wsuccess.add(client.waitingTime); else this.Wcancel.add(client.waitingTime);
    if (success) this.S.add(client.serviceTime);
    this.V.add(client.waitingTime+client.serviceTime);
  }

  /**
   * Updates the system states in the statistics.
   * @param {Object} simulator Simulator object from which the data is to be recorded.
   */
  updateState(simulator) {
    const agentsFree=simulator.data.freeAgents;
    const agentsBusy=simulator.model.agents-agentsFree;
    const NQ=simulator.data.queue.length;
    const N=NQ+simulator.data.clientsInServiceProcess;

    const time=simulator.time;

    this.N.set(time,N);
    this.NQ.set(time,NQ);
    this.agentsFree.set(time,agentsFree);
    this.agentsBusy.set(time,agentsBusy);
  }
}





/**
 * Runtime data record for a client in the system.
 */
class Client {
  /**
   * Constructor
   * @param {Number} time Time when the client enters the system
   */
  constructor(time) {
    this.startWaitingTime=time;
    this.waitingTime=0;
    this.serviceTime=0;
    this.cancelEvent=null;
  }
}





/**
 * Client arrival event
 */
class ArrivalEvent extends simcore.Event {
  /**
   * Constructor
   * @param {Number} time Planned execution time
   * @param {Boolean} isFreshCall Is it a fresh call (true) or a retry call (false)?
   */
  constructor(time,isFreshCall) {
    super(time);
    this.isFreshCall=isFreshCall;
  }

  execute(simulator) {
    /* Process arrivals */
    if (this.isFreshCall) {
      for (let i=0;i<simulator.model.batchArrival;i++) simulator.processArrival(true);

      /* Create next arrival event if nessessary */
      if (simulator.data.arrivalCount<simulator.model.arrivalCount+simulator.model.arrivalCountWarmUp) {
        ArrivalEvent.scheduleNext(simulator);
      }
    } else {
      simulator.processArrival(false);
    }
  }

  /**
   * Generates and adds an arrival event for the next client batch
   * @param {Object} simulator Simulator object (for reading inter-arrival time distribution and for adding event)
   */
  static scheduleNext(simulator) {
    const time=simulator.time;
    const delta=simulator.model.interArrivalTimesDistribution();
    simulator.addEvent(new ArrivalEvent(time+delta,true));

    /* Logging */
    simulator.log(simulator.language.logging.scheduleNext+' '+simcore.formatTime(time)+'+'+simcore.formatTime(delta)+'='+simcore.formatTime(time+delta));
  }

  /**
   * Generates and adds an retry arrival event for the next client batch
   * @param {Object} simulator Simulator object (for reading retry time distribution and for adding event)
   */
  static scheduleRetry(simulator) {
    const time=simulator.time;
    const delta=simulator.model.retryDistribution();
    simulator.addEvent(new ArrivalEvent(time+delta,false));

    /* Logging */
    simulator.log(simulator.language.logging.scheduleRetry+' '+simcore.formatTime(time)+'+'+simcore.formatTime(delta)+'='+simcore.formatTime(time+delta));
  }
}





/**
 * Call cancelation event
 */
class CancelEvent extends simcore.Event {
  /**
   * Constructor
   * @param {Number} time Planned execution time
   * @param {Object} client Client which will cancel waiting at the given time
   */
  constructor(time,client) {
    super(time);
    this.client=client;
  }

  execute(simulator) {
    simulator.waitingCancelation(this.client,true);
  }
}





/**
 * Event will be executed when an agents finishes serving a clients batch
 */
class ServiceDoneEvent extends simcore.Event {
  /**
   * Constructor
   * @param {Number} time Planned execution time
   * @param {Array} clients Clients which were served
   */
  constructor(time,clients) {
    super(time);
    this.clients=clients;
  }

  execute(simulator) {
    simulator.serviceDone(this.clients);
  }
}





/**
 * Event will be executed when the post-processing time of an agent (after serving a client) is done
 */
class PostProcessingDoneEvent extends simcore.Event {
  /**
   * Constructor
   * @param {Number} time Planned execution time
   */
  constructor(time) {
    super(time);
  }

  execute(simulator) {
    simulator.postProcessingDone();
  }
}





/**
 * Simulator main class
 */
callcenter.Simulator=class Simulator extends simcore.Simulator {
  /**
   * Constructor
   * @param {Object} model Model to be simulated
   * @param {Object} logger Logging callback function (can be null)
   */
  constructor(model,logger,language) {
    super(logger);
    this.model=model;
	this.language=language;
    this.data=new CallcenterData(model);
    this.statistics=new callcenter.Statistics();

    /* Schedule first arrival */
    ArrivalEvent.scheduleNext(this);
  }

  /**
   * Process arrival of a client
   * @param {Boolean} isFreshCall Is it a fresh call (true) or a retry call (false)
   */
  processArrival(isFreshCall) {
    if (isFreshCall) {
      /* Count arrival */
      this.data.arrivalCount++;

      /* End of warm-up phase */
      if (this.data.isWarmUpPeriod && this.data.arrivalCount>this.model.arrivalCountWarmUp) {
        this.data.isWarmUpPeriod=false;
        this.statistics.reset();
			  this.statistics.updateState(this);
      }
    }

    /* Logging */
    this.log(this.language.logging.arrival+isFreshCall);

    /* Statistics */
    this.statistics.logArrival(this.time,isFreshCall);

    /* Queue or servce client */
    const client=new Client(this.time);
    client.serviceTime=this.model.serviceTimesDistribution();
    this.processClient(client);
  }

  getClientFromQueue() {
	  let nextClient;
    let index;
    let serviceTime;
    switch (this.model.queueingDiscipline) {
      case 0: /* FIFO */
        nextClient=this.data.queue.shift();
        break;
      case 1: /* Random */
        index=Math.floor(Math.random()*this.data.queue.length);
        nextClient=this.data.queue.splice(index,1)[0];
        break;
      case 2: /* LIFO */
        nextClient=this.data.queue.pop();
        break;
      case 3: /* SJF */
        index=0;
        serviceTime=this.data.queue[0].serviceTime;
        for (let i=1;i<this.data.queue.length;i++) if (this.data.queue[i].serviceTime<serviceTime) {index=i; serviceTime=this.data.queue[i].serviceTime;}
        nextClient=this.data.queue.splice(index,1)[0];
        break;
      case 4: /* LJF */
        index=0;
        serviceTime=this.data.queue[0].serviceTime;
        for (let i=1;i<this.data.queue.length;i++) if (this.data.queue[i].serviceTime>serviceTime) {index=i; serviceTime=this.data.queue[i].serviceTime;}
        nextClient=this.data.queue.splice(index,1)[0];
        break;
    }
    if (nextClient.cancelEvent!=null) this.removeEvent(nextClient.cancelEvent);
    return nextClient;
  }

  /**
   * Queue or serve a client (after arrival or when forwarding)
   * @param {Object} client Client to be queued or served
   */
  processClient(client) {
    if (this.data.freeAgents>0) {
      if (this.model.batchService==1) {
        this.log(this.language.logging.processStart);
        this.startService([client]);
        return;
      } else {
        if (this.data.queue.length+1>=this.model.batchService) {
          this.log(this.language.logging.processStart);
          let serviceBatch=[client];
          for (let i=0;i<this.model.batchService-1;i++) {
            serviceBatch.push(this.getClientFromQueue());
          }
          this.startService(serviceBatch);
          return;
        } else {
          this.log(this.language.logging.processWaitingForBatchSize);
        }
      }
    }

    if (!this.model.hasWaitingRoomSize || this.data.queue.length<this.model.waitingRoomSize) {
      if (this.data.freeAgents==0) {
        this.log(this.language.logging.processAddToQueue);
      }
      this.addToQueue(client);
    } else {
      if (this.data.freeAgents>0) {
        this.log(this.language.logging.processQueueFull);
      } else {
        this.log(this.language.logging.processNoOperatorAndQueueFull);
      }
      this.waitingCancelation(client,false);
    }
  }

  /**
   * Start process of serving one or more client
   * @param {Array} clients Batch of clients to be served
   */
  startService(clients) {
    this.data.freeAgents--;
    this.data.clientsInServiceProcess+=clients.length;
    this.statistics.updateState(this);

    /* Calculate service time */
    let serviceTime=0;
    const discipline=this.model.queueingDiscipline;
    if (discipline==0 || discipline==1 || discipline==2) {
      /* FIFO / Random / LIFO */
      serviceTime=clients[0].serviceTime; /* Use service time of first client in batch - using max would result in biased service time */
    } else {
      for (let i=0;i<clients.length;i++) {
        serviceTime=Math.max(serviceTime,clients[i].serviceTime); /* Using maximum is not perfect, but the best we can do. */
      }
    }

    for (let i=0;i<clients.length;i++) {
      clients[i].waitingTime=this.time-clients[i].startWaitingTime;
      clients[i].serviceTime=serviceTime;
    }

    this.addEvent(new ServiceDoneEvent(this.time+serviceTime,clients));

    /* Logging */
    for (let i=0;i<clients.length;i++) {
      this.log(this.language.logging.processStartService+simcore.formatTime(clients[i].serviceTime)+', '+this.language.logging.processStartWaitingInfo+simcore.formatTime(clients[i].waitingTime));
    }
  }

  /**
   * End of serving some clients
   * @param {Array} clients Which have be served
   */
  serviceDone(clients) {
    this.data.clientsInServiceProcess-=clients.length;
    this.statistics.updateState(this);

    /* Logging */
    for (let i=0;i<clients.length;i++) {
      this.log(this.language.logging.processServiceDone+simcore.formatTime(clients[i].serviceTime));
    }

    /* Create event for end of post-processing time */
    const delta=this.model.postProcessingTimesDistribution();
    this.addEvent(new PostProcessingDoneEvent(this.time+delta));
    this.statistics.S2.add(delta);

    /* Logging */
    this.log(this.language.logging.processPostProcessingTime+simcore.formatTime(delta));

    /* Statistics */
    for (let i=0;i<clients.length;i++) {
      this.statistics.logClientService(clients[i],true);
      this.statistics.logLeave(this.time,true);
    }

    if (this.model.forwardingProbability>=Math.random()) {
      /* Forwarding */
      this.log(this.language.logging.processForwarding);
      this.statistics.callsForward.add();
      this.processClient(new Client(this.time));
    }
  }

  /**
   * End of post-processing phase for an agent
   */
  postProcessingDone() {
    this.log(this.language.logging.processPostProcessingDone);

    this.data.freeAgents++;
    this.statistics.updateState(this);

    if (this.data.queue.length>=this.model.batchService) {
      this.log(this.language.logging.processStartFromQueue1+this.data.queue.length+this.language.logging.processStartFromQueue2+this.model.batchService+this.language.logging.processStartFromQueue3);
      let serviceBatch=[];
      for (let i=0;i<this.model.batchService;i++) {
        serviceBatch.push(this.getClientFromQueue());
      }
      this.startService(serviceBatch);
    } else {
      if (this.data.queue.length>0) {
        this.log(this.language.logging.processQueueMinBatchSize1+this.data.queue.length+this.language.logging.processQueueMinBatchSize2);
      }
    }
  }

  /**
   * Adds an client to the queue
   * @param {Object} client
   */
  addToQueue(client) {
    /* Queue client */
    this.data.queue.push(client);
    this.statistics.updateState(this);

    let delta;
    if (this.model.hasImpatience) {
      /* Waiting cancelation event */
      delta=this.model.waitingTimeToleranceDistribution();
      const cancelEvent=new CancelEvent(this.time+delta,client);
      client.cancelEvent=cancelEvent;
      this.addEvent(cancelEvent);
    } else {
	  delta=-1;
	  client.cancelEvent=null;
    }

    /* Logging */
	if (delta>0) {
      this.log(this.language.logging.processAddToQueueInfoA1+simcore.formatTime(delta)+this.language.logging.processAddToQueueInfoA2+this.data.queue.length);
	} else {
      this.log(this.language.logging.processAddToQueueInfoB+this.data.queue.length);
    }
  }

  /**
   * A client leaves the system without being served.
   * @param {Object} client Client which leaves the system.
   * @param {Boolean} isClientInQueue Is the client in the queue (e.g. a waiting time cancelation; true) or was he already blocked on entering the system (due to waiting room limitations; false)
   */
  waitingCancelation(client,isClientInQueue) {
    /* Remove client from queue */
    if (isClientInQueue) {
      const index=this.data.queue.indexOf(client);
      if (index>=0) this.data.queue.splice(index,1);
      this.statistics.updateState(this);
    }

    /* Logging */
    this.log(this.language.logging.Cancelation+isClientInQueue);

    /* Statistics */
    client.waitingTime=this.time-client.startWaitingTime;
    this.statistics.logLeave(this.time,false);
    this.statistics.logClientService(client,false);

    if (this.model.retryProbability>=Math.random()) {
      ArrivalEvent.scheduleRetry(this);
    }
  }
}
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

'use strict';

const simcore={};





/**
 * Base class for events
 */
simcore.Event=class Event {
  /**
   * Constructor
   * @param {Number} time Planned execution time
   */
  constructor(time) {
    this.time=time;
  }

  /**
   * Will be called by simulator when event is to be executed.
   * @param {Simulator} simulator Corresponding simulator object (for accessing simulation data and for planning new events)
   */
  execute(simulator) {
  }
}





/**
 * Sorted event list
 */
simcore.EventList=class EventList {
  /**
   * Constructor
   */
  constructor() {
    this.list=[];
  }

  /**
   * Number of events currently in list.
   */
  get length() {
    return this.list.length;
  }

  /**
   * Adds a new event to the sorted list of events.
   * @param {Event} event Event to be added to list
   */
  add(event) {
    if (this.list.length==0) {
      this.list.push(event);
      return;
    }

    let a=0;
    let b=this.list.length-1;
    while (b-a>2) {
      const m=Math.round((a+b)/2);
      const mTime=this.list[m].time;
      if (mTime>event.time) {
        b=m;
      } else {
        a=m;
      }
    }

    for (let i=a;i<=b;i++) if (this.list[i].time>=event.time) {
      this.list.splice(i,0,event);
      return;
    }
    this.list.splice(b+1,0,event);
  }

  /**
   * Removes the event with the lowest execution time from list and returns it.
   * @returns Next event to be executed (or null if no events are in list)
   */
  next() {
    if (this.list.length==0) return null;
    return this.list.shift();
  }

  /**
   * Clears the event list.
   */
  clear() {
    list=[];
  }

  /**
   * Removes an element from the events list.
   * @param {Event} event Event to be removed
   * @returns Returns true if the event was in the list and could be removed (otherwise false)
   */
  remove(event) {
    for (let i=0;i<this.list.length;i++) if (this.list[i]==event) {
      this.list.splice(i,1);
      return true;
    }
    return false;
  }
}





/**
 * Simulator main class
 */
simcore.Simulator=class Simulator {
  /**
   * Constructor
   * @param {Function} logger Callback for logger (function acceptiong a string) or null, if no logging is intended
   */
  constructor(logger) {
    this.logger=logger;
    this.events=new simcore.EventList();
    this.executionCount=0;
    this.currentTime=0;
    this.lastLogTime=-1;
  }

  /**
   * Gets the number of executed events.
   */
  get count() {
    return this.executionCount;
  }

  /**
   * Gets the execution time of the current event.
   */
  get time() {
    return this.currentTime;
  }

  /**
   * Adds an event to the list of events to be executed.
   * @param {Event} event Event to be executed
   */
  addEvent(event) {
    this.events.add(event);
  }

  /**
   * Removes an event from the list of events to be executed (without executing it)
   * @param {Event} event   Event to be removed
   * @returns Returns true if the event was in the list and could be removed (otherwise false)
   */
  removeEvent(event) {
    if (event==null) return false;
    return this.events.remove(event);
  }

  /**
   * Executes the next waiting event.
   * @returns Returns true if there was an event to be executed, otherwise (if the events list is empty) false.
   */
  executeNext() {
    const event=this.events.next();
    if (event==null) return false;
    this.currentTime=event.time;
    event.execute(this);
    this.executionCount++;
    return true;
  }

  /**
   * Logs a messing together with the current timestamp
   * @param {String} message  Message to be send to logger (if there is a logger)
   */
  log(message) {
    if (this.logger==null) return;

    if (this.lastLogTime>=0 && this.lastLogTime!=this.currentTime) this.logger("");
    this.logger(simcore.formatTime(this.currentTime)+": "+message);
    this.lastLogTime=this.currentTime;
  }
}





/**
 * Formats a number as HH:MM:SS,s string
 * @param {Number} time Timestamp to be formated
 */
simcore.formatTime=function(time) {
  time=Math.round(time*10);

  let frac=time%10;
  let fmt="."+frac;
  time=Math.floor(time/10);

  frac=time%60;
  if (frac<10) fmt=":0"+frac+fmt; else fmt=":"+frac+fmt;
  time=Math.floor(time/60);

  frac=time%60;
  if (frac<10) fmt=":0"+frac+fmt; else fmt=":"+frac+fmt;
  time=Math.floor(time/60);

  return ""+time+fmt;
}





/**
 * Timer for measuring execution times (in ms)
 */
simcore.Timer=class Timer {
  /**
   * Constructor
   */
  constructor() {
    this.startTime=this.currentTime;
  }

  /**
   * Gets the current system time in ms.
   */
  get currentTime() {
    return new Date().getTime();
  }

  /**
   * Returns the time in ms since starting the stop watch.
   */
  get time() {
    return this.currentTime-this.startTime;
  }
}
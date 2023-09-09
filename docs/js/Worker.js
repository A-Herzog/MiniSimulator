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

import {callcenter} from "./Callcenter.js";
import {simcore} from './SimCore.js';

onmessage = function(e) {
  const workerIndex=e.data.index;
  const model=e.data.model;
  const language=e.data.language;
  callcenter.initModel(model);

  const simulator=new callcenter.Simulator(model,null,language);

  const timer=new simcore.Timer();
  while (simulator.executeNext()) if (simulator.count%100000==0) {
    postMessage({
	  index: workerIndex,
	  mode: "Status",
	  events: simulator.count,
	  arrivals: simulator.data.arrivalCount,
	  time: timer.time
	});
  }

  postMessage({
	index: workerIndex,
	mode: "Result",
	statistics: simulator.statistics.makePlain(),
	events: simulator.count,
	arrivals: simulator.data.arrivalCount,
	time: timer.time
  });
}
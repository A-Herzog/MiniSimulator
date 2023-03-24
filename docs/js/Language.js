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

let lang;

/* German */

const languageDE={};

lang=languageDE;

lang.multiCore={};
lang.multiCore.two='Zwei parallele Rechenthreads verwenden';
lang.multiCore.number=' parallele Rechenthreads verwenden';
lang.multiCore.info='Verteilt die Rechenlast auf alle CPU-Kerne. Wenn diese Option deaktiviert ist, wird nur ein Kern verwendet.';

lang.GUI={};
lang.GUI.imageMode="de";
lang.GUI.Name="G/G/c/K+G Simulator";
lang.GUI.PrivacyTitle="Info";
lang.GUI.PrivacyInfo="Alle Simulationen laufen vollständig im Browser ab.<br>Diese Webapp führt nach dem Laden des HTML- und Skriptcodes keine weitere Kommunikation mit dem Server durch.";
lang.GUI.OtherLanguage="An <a href=\"index.html\" onclick=\"localStorage.setItem('selectedLanguage','default')\"><b>English version</b></a> of this simulator is also available.";
lang.GUI.resetSettings='Sollen wirklich alle Modelleinstellungen zurückgesetzt werden?';
lang.GUI.resetSettingsButton='Beispielmodelle';
lang.GUI.resetSettingsMD1="<b>M/D/1 Modell</b><br><small>(exponentielle Zwischenankunftszeiten, konstante Bedienzeiten, 1 Bediener)</small>";
lang.GUI.resetSettingsMM1="<b>M/M/1 Modell <span class=\"badge bg-primary\">Standardbeispiel</span></b><br><small>(exponentielle Zwischenankunfts- und Bedienzeiten, 1 Bediener)</small>";
lang.GUI.resetSettingsMMc="<b>M/M/5 Modell</b><br><small>(exponentielle Zwischenankunfts- und Bedienzeiten, 5 Bediener)</small>";
lang.GUI.resetSettingsMGc="<b>M/G/5 Modell</b><br><small>(exponentielle Zwischenankunftszeiten, Log-normal verteilte Bedienzeiten, 5 Bediener)</small>";
lang.GUI.explanationsShow="Erklärungen einblenden";
lang.GUI.explanationsHide="Erklärungen ausblenden";
lang.GUI.tabModel='Modell';
lang.GUI.tabModelInfo1='Bei dem in diesem Simulator abgebildeten Modell handelt es sich um ein <b>G/G/c/K+G</b>-Warteschlangenmodell, d.h. es treffen Kunden gemäß einer beliebigen Verteilung für die Zwischenankunftszeiten (<b>G</b>) an dem System ein. Für die Bedienzeiten kommt ebenfalls eine beliebige Wahrscheinlichkeitsverteilung (<b>G</b>) zur Anwendung. Bedient werden die Kunden durch <b>c</b> Bediener und der Warteraum besitzt eine maximale Kapazität von <b>K</b> Kunden. Des Weiteren sind <b>Batch-Ankünfte</b> und <b>Batch-Bediengungen</b> möglich. Auch können eine begrenzte <b>Wartezeittoleranz</b> (<b>G</b>), <b>Wiederholungen</b> und <b>Weiterleitungen</b> modelliert werden.';
lang.GUI.tabModelInfo2='Im Kontext der analytischen Warteschlangentheorie können die Kenngrößen eines Modells, welches die oben genannten Eigenschaften vollständig nutzt, bereits nicht mehr exakt berechnet werden. Mit Hilfe von <a href="https://de.wikipedia.org/wiki/Ereignisorientierte_Simulation" target="_blank">ereignisorientierter stochastischer Simulation</a> können derartige Modelle jedoch problemlos untersucht werden. Mit <a href="#linkMore">umfangreicheren Simulationstools</a> können auch weit komplexere Modelle in kurzer Zeit simuliert werden.<br><br>Die im Folgenden verwendeten Begriffe werden im <a href="info_de.html?glossary" target="_blank">Glossar</a> definiert. Eine Kurzeinführung in das Thema Warteschlangentheorie und -simulation findet sich auf der Seite <a href="info_de.html?qt" target="_blank">Grundkonzepte der Warteschlangentheorie</a> und eine ausführlichere Erklärung zum Thema Warteschlangensimulation kann im Lehrbuch <a href="https://www.springer.com/gp/book/9783658346676">Simulation mit dem Simulation mit dem Warteschlangensimulator</a> nachgelesen werden.';
lang.GUI.tabModelImage='Model_de.svg';
lang.GUI.tabArrivals='Ankünfte';
lang.GUI.tabWaitingRoom='Warteraum';
lang.GUI.tabService='Bedienung';
lang.GUI.tabSimulation='Simulation';
lang.GUI.tabSimulationIndicators='Kenngrößen berechnen';
lang.GUI.tabSimulationIndicatorsInfo='Je mehr Ankünfte simuliert werden, desto besser gleichen sich Schwankungen im Ankunftsprozess aus und desto stabiler sind die Ergebnisse - aber auch desto länger fallen die Simulationslaufzeiten aus.';
lang.GUI.tabMore='Download';
lang.GUI.tabMoreLong='Weitere Simulatoren';
lang.GUI.tabHelp="Hilfe";
lang.GUI.tabHelpDoc="Warteschlangentheorie";
lang.GUI.tabHelpGlossary="Glossar";
lang.GUI.tabHelpTextbook="Lehrbuch<br>\"Simulation mit dem<br>Warteschlangensimulator\"";
lang.GUI.startSimulation='Simulation starten';
lang.GUI.cancelSimulation='Simulation abbrechen';
lang.GUI.recordSimulation='Simulation aufzeichnen';
lang.GUI.recordSimulationInfo='In diesem Modus werden lediglich <b>100</b> Kundenankünfte simuliert. Es werden keine Kenngrößen aufzeichnet, dafür wird aber zu jedem Simulationsschritt eine Beschreibung ausgegeben. Auf diese Weise kann der Ablauf einer Simulation bzw. die Funktionsweise des Simulators nachverfolgt werden.';
lang.GUI.output='Ausgabe';
lang.GUI.outputClear='Ausgabe löschen';
lang.GUI.simulators="Simulatoren";
lang.GUI.simulatorsQueueCalc="Warteschlangenrechner";
lang.GUI.closePage="Seite schließen";
lang.GUI.homeURL="warteschlangensimulation.de";

lang.logging={};
lang.logging.scheduleNext='Planung der nächsten Kundenankunft';
lang.logging.scheduleRetry='Kunde wird einen neuen Anrufversuch tätigen:';
lang.logging.arrival='Ankunft eines Kunden, Erstanrufer=';
lang.logging.processStart='Bediener verfügbar, Bedienung kann sofort starten.';
lang.logging.processAddToQueue='Es ist kein Bediener verfügbar, Kunde stellt sich an Warteschlange an.';
lang.logging.processAddToQueueInfoA1='Kunde stellt sich an Warteschlange an, Wartezeittoleranz=';
lang.logging.processAddToQueueInfoA2=', Kunden in der Warteschlange=';
lang.logging.processAddToQueueInfoB='Kunde stellt sich an Warteschlange an, Kunden in der Warteschlange=';
lang.logging.processQueueFull='Es ist kein Platz in der Warteschlange.';
lang.logging.processNoOperatorAndQueueFull='Es ist kein Bediener verfügbar und auch kein Platz in der Warteschlange.';
lang.logging.processWaitingForBatchSize='Bediener verfügbar, aber erforderliche Bedien-Batch-Größe noch nicht erreicht.';
lang.logging.processStartService='Bedienung eines Kunden beginnt, Bedienzeit=';
lang.logging.processStartWaitingInfo='vorherige Wartezeit=';
lang.logging.processServiceDone='Bedienung eines Kunden abgeschlossen, Bedienzeit war ';
lang.logging.processPostProcessingTime='Nachbearbeitungszeit=';
lang.logging.processForwarding='Kunde wird weitergeleitet';
lang.logging.processPostProcessingDone='Ende der Nachbearbeitungszeit für einen Bediener';
lang.logging.processStartFromQueue1='Es warten weitere ';
lang.logging.processStartFromQueue2=' Kunden, nächste Bedienung (';
lang.logging.processStartFromQueue3=' Kunden) kann direkt beginnen.';
lang.logging.processQueueMinBatchSize1='Es warten weitere ';
lang.logging.processQueueMinBatchSize2=' Kunden, dies ist aber noch zu wenig für einen Bedien-Batch.';
lang.logging.Cancelation='Kunde verlässt unbedient das System. Kunde war in Warteschlange=';

lang.statistics={};
lang.statistics.mean='Mittelwert';
lang.statistics.variation='Streuung';
lang.statistics.range='Bereich';
lang.statistics.queue='Warteschlange';
lang.statistics.times='Zeiten';
lang.statistics.queueAverage='Mittlere Warteschlangenlänge';
lang.statistics.numberOfClientsInSystem='Anzahl an Kunden im System';
lang.statistics.numberOfClientsInSystemAverage='Mittlere Anzahl an Kunden im System';
lang.statistics.numberOfCallers='Anzahlen an Anrufern';
lang.statistics.numberOfCallersFreshCalls='Erstanrufer';
lang.statistics.numberOfCallersRetryers='Wiederholer';
lang.statistics.numberOfCallersForwardings='Weiterleitungen';
lang.statistics.numberOfCallersSuccessfulCalls='Erfolgreiche Anrufe';
lang.statistics.numberOfCallersCanceledCalls='Abbrecher';
lang.statistics.interArrivalTimes='Zwischenankunftszeiten';
lang.statistics.interLeaveTimes='Zwischenabgangszeiten';
lang.statistics.waitingTimesSuccess='Wartezeiten (erfolgreiche Kunden)';
lang.statistics.waitingTimesCancel='Abbruchzeiten';
lang.statistics.waitingTimesAll='Wartezeiten (über alle Kunden)';
lang.statistics.waitingTimes='Wartezeiten';
lang.statistics.serviceTimes='Bedienzeiten';
lang.statistics.postprocessingTimes='Nachbearbeitungszeiten';
lang.statistics.residenceTimes='Verweilzeiten';
lang.statistics.operators='Bediener';
lang.statistics.operatorsAverageBusy='Mittlere Anzahl an belegten Bedienern';
lang.statistics.workload='Auslastung';
lang.statistics.simulationSystem='Simulationssystem';
lang.statistics.simulationSystemSimulatedEvents='Simulierte Ereignisse';
lang.statistics.simulationSystemNeededTime='Benötigte Rechenzeit';
lang.statistics.simulationSystemUsedThreads='Verwendete Rechenthreads';
lang.statistics.decimalSeparatorInfo='In der Ausgabe werden Dezimaltrenner gemäß der gewählten Landeseinstellung verwendet.';
lang.statistics.compareFormulaExtErlangC="erweiterte Erlang-C-Formel";
lang.statistics.compareFormulaErlangC="Erlang-C-Formel";
lang.statistics.compareFormulaAC="Allen-Cunneen-Näherungsformel";
lang.statistics.compareValuesErlangC="Erlang-C-Vergleichswerte";
lang.statistics.compareValuesAC="Allen-Cunneen-Vergleichswerte";
lang.statistics.compareRelativeDifference="relative Abweichung zur Simulation";
lang.statistics.compareInfoOk1="Das Modell kann vollständig durch die ";
lang.statistics.compareInfoOk2=" beschrieben werden.";
lang.statistics.compareReasonsHeading="Das Modell besitzt folgende Eigenschaften, die in der Formel nicht berücksichtigt werden (und damit die Ursache für Abweichungen zwischen Simulations- und Formelergebnissen darstellen):";
lang.statistics.compareReasonsInterArrivalIsNotExp="Die Zwischenankunftszeiten sind nicht exponentiell verteilt.";
lang.statistics.compareReasonsInterServiceIsNotExp="Die Bedienzeiten sind nicht exponentiell verteilt.";
lang.statistics.compareReasonsWaitingTimeTolerancesNotExp="Die Wartezeittoleranzen sind nicht exponentiell verteilt.";
lang.statistics.compareReasonsArrivalBatch="Die Kunden treffen in Gruppen ein.";
lang.statistics.compareReasonsServiceBatch="Die Kunden werden in Gruppen bedient.";
lang.statistics.compareReasonsRetry="Es existieren Wiederholungen.";
lang.statistics.compareReasonsForwarding="Es existieren Weiterleitungen.";
lang.statistics.compareReasonsPostProcessing="Es existieren Nachbearbeitungszeiten.";

lang.model={};
lang.model.waitingRoomSize='Größe des Warteraumes';
lang.model.finiteWaitingRoomSize='Warteraum ist nur begrenzt groß';
lang.model.waitingRoomSizeInfo='Wenn die Größe des Warteraumes limitiert ist und ein Kunde eintrifft, während alle Warteplätze belegt sind, wird dieser abgewiesen. Dies ist vergleichbar mit einem Warteabbruch. Kunden, die sich bereits in Bedienung befinden, belegen keinen Warteraum.';
lang.model.waitingRoomSizeInfo2='Die Warteraumgröße muss eine nichtnegative Ganzzahl sein.';
lang.model.InterArrivalTimes='Zwischenankunftszeiten';
lang.model.InterArrivalTimesInfo='Die Basis für jedes Warteschlangenmodell stellen die Kundenankünfte dar. Definiert werden die Kundenankünfte über ihre Zwischenankunftszeiten, d.h. die Abstände zwischen zwei unmittelbar aufeinander folgende Ankünften.';
lang.model.distributionInterArrivalTime='Verteilung der Zwischenankunftszeiten';
lang.model.averageInterArrivalTime='Mittlere Zwischenankunftszeit';
lang.model.stdDevInterArrivalTime='Standardabweichung der Zwischenankunftszeiten';
lang.model.arrivalBatchSize='Ankunftsbatchgröße';
lang.model.arrivalBatchSizeInfo='Optional können pro Ankunftsereignis jeweils mehrere Kunden eintreffen. In diesem Fall spricht man von Batch-Ankünften. Wird als Ankunftsbatchgröße <b>1</b> gewählt, so treffen die Kunden einzeln ein.';
lang.model.arrivalBatchSizeInfo2='Anzahl an Kunden pro Ankunftsereignis (muss eine positive Ganzzahl sein).';
lang.model.waitingTimeTolerance='Wartezeittoleranz';
lang.model.waitingTimeToleranceInfo='Optional können die Kunden eine begrenzte Wartebereitschaft besitzen. Ist diese überschritten, so verlassen sie die Warteschlange, ohne bedient worden zu sein.';
lang.model.averageWaitingTimeTolerance='Mittlere Wartezeittoleranz';
lang.model.stdDevWaitingTimeTolerance='Standardabweichung der Wartezeittoleranzen';
lang.model.distributionWaitingTimeTolerance='Verteilung der Wartezeittoleranzen';
lang.model.finiteWaitingTimeTolerance='Kunden besitzen endliche Wartezeittoleranz';
lang.model.retryProbability='Wiederholwahrscheinlichkeit';
lang.model.retryProbabilityInfo='Wurde ein Kunde abgewiesen, weil bei seinem Eintreffen kein Platz mehr in der Warteschlange war, oder hat er das Warten vorzeitig aufgegeben, so kann er das System entweder endgültig unbedient verlassen oder aber später einen neuen Anrufversuch tätigen. Die Wiederholwahrscheinlichkeit gibt an, mit welcher Wahrscheinlichkeit ein Kunde, der das System unbedingt verlassen hat, später einen neuen Anrufversuch tätigt.';
lang.model.retryProbabilityInfo2='Die Wiederholwahrscheinlichkeit muss eine Zahl zwischen 0 und 1 sein.';
lang.model.retryTime='Wiederholabstände';
lang.model.retryTimeInfo='Hat ein Kunde aufgrund einer Warteschlangen-Blockierung oder weil er das Warten abgebrochen hat, das System verlassen, aber sich entschieden, später einen weiteren Anrufversuch zu starten, so führt er diesen nicht sofort aus, sondern erst nach einiger Zeit. Die Wiederholabständeverteilung gibt an, wie groß dieser Abstand ausfällt.';
lang.model.distributionRetryTime='Verteilung der Wiederholabstände';
lang.model.averageRetryTime='Mittlerer Wiederholabstand';
lang.model.stdDevRetryTime='Standardabweichung der Wiederholabstände';
lang.model.numberOfOperators='Anzahl an Bedienern';
lang.model.numberOfOperatorsInfo='An dem Bedienschalter werden die Kunden durch die Agenten bedient. Jeder Agent kann jeweils maximal einen Kunden bzw. einen Kunden-Batch (wenn Batch-Bedienungen verwendet werden) gleichzeitig bedienen. Befinden sich nicht genug Kunden im System, so befinden sich ein Teil oder alle Agenten im Leerlauf. Befinden sich mehr Kunden im System, als gleichzeitig bedient werden können, so muss ein Teil der Kunden warten.';
lang.model.numberOfOperatorsInfo2='Die Anzahl an Bedienern muss eine positive Ganzzahl sein.';
lang.model.serviceTimes='Bedienzeiten';
lang.model.serviceTimesInfo='Gemäß der Bedienzeitenverteilung wird bestimmt, wie lange jeweils ein Bedienvorgang dauert.';
lang.model.distributionServiceTime='Verteilung der Bedienzeiten';
lang.model.averageServiceTime='Mittlere Bedienzeit';
lang.model.stdDevServiceTime='Standardabweichung der Bedienzeiten';
lang.model.serviceBatchSize='Bedienbatchgröße';
lang.model.serviceBatchSizeInfo='Optional können pro Bedienung jeweils mehrere Kunden gleichzeitig bedient werden. In diesem Fall spricht man von Batch-Bedienungen. Wird als Bedienbatchgröße <b>1</b> gewählt, so werden die Kunden einzeln bedient. Ist eine Batch-Größe größer als 1 gewählt, so wird ein Bedienvorgang erst gestartet, wenn sich eine eintsprechende Anzahl an Kunden in der Warteschlange befindet (d.h. es kann der Fall auftreten, dass einzelne Kunden warten müssen, obwohl sich Bediener im Leerlauf befinden).';
lang.model.serviceBatchSizeInfo2='Anzahl an Kunden pro Bedienung (muss eine positive Ganzzahl sein).';
lang.model.postProcessingTimes='Nachbearbeitungszeiten';
lang.model.postProcessingTimesInfo='Optional kann nach einer Bedienung noch eine Nachbearbeitungszeit notwendig sein bevor sich der Bediener wieder als verfügbar für die nächste Bedienung meldet. Während der Nachbearbeitungszeit befindet sich der Kunde bereits nicht mehr im System (oder wurde weitergeleitet). Der Bediener ist jedoch weiterhin durch Nacharbeiten gebunden.';
lang.model.distributionPostProcessingTime='Verteilung der Nachbearbeitungszeiten';
lang.model.averagePostProcessingTime='Mittlere Nachbearbeitungszeit';
lang.model.stdDevPostProcessingTime='Standardabweichung der Nachbearbeitungszeiten';
lang.model.servicePolicy='Bedienreihenfolge';
lang.model.servicePolicyInfo='Die Bedienreihenfole gibt an, nach welchem Prinzip wartende Kunden aus der Warteschlange entnommen werden. Werden die Kunden in Ankunftsreihenfolge bedient, d.h. bilden die wartenden Kunden eine klassische Warteschlange, so spricht man von der <b>FIFO-Bedienreihenfolge</b> (First in first out). Werden die Kunden in umgekehrter Ankunftsreihenfolge bedient, so nennt sich dies die <b>LIFO-Bedienreihenfolge</b> (Last in first out). LIFO kommt immer dann zum Einsatz, wenn es sich bei den Kunden um Werkstücke handelt, die gestapelt werden und neu eintreffende Werkstücke nur oben auf den Stapel gelegt werden können und das jeweils als nächstes zu bearbeitende Werkstück ebenfalls nur von oben aus dem Stapel entnommen werden kann.';
lang.model.servicePolicyFIFO='FIFO - First in first out';
lang.model.servicePolicyLIFO='LIFO - Last in first out';
lang.model.servicePolicyRandom='RANDOM - Zufällige Auswahl des nächsten Kunden';
lang.model.forwarding='Weiterleitungen';
lang.model.forwardingProbability='Weiterleitungswahrscheinlichkeit';
lang.model.forwardingInfo='Nach einem Gespräch mit einem Agenten kann es notwendig sein, dass der Kunde noch einmal zur Warteschlange geleitet wird, um mit einem weiteren Agenten zu sprechen. Die Wahrscheinlichkeit, mit der solch eine Weiterleitung stattfindet, nennt sich die Weiterleitungswahrscheinlichkeit.';
lang.model.forwardingInfo2='Die Weiterleitungswahrscheinlichkeit muss eine Zahl zwischen 0 und 1 sein.';
lang.model.numberOfArrivals='Anzahl an Ankünften';
lang.model.numberOfArrivalsInfo='Anzahl an zu simulierenden Ankünften (muss eine positive Ganzzahl sein).';
lang.model.warmUpPhase='Zusätzliche Ankünfte für Einschwingphase';
lang.model.warmUpPhaseInfo='Anzahl an zusätzlich zu simulierenden Ankünften, die nicht in der Statistik erfasst werden (muss eine nichtnegative Ganzzahl sein).';
lang.model.errorNonNegativeNumber='Es muss eine nichtnegative Zahl angegeben werden.';
lang.model.errorPositiveNumber='Es muss eine positive Zahl angegeben werden.';
lang.model.errorNonNegativeInteger='Es muss eine nichtnegative Ganzzahl angegeben werden.';
lang.model.errorPositiveInteger='Es muss eine positive Ganzzahl angegeben werden.';
lang.model.errorProbability='Es muss eine Zahl zwischen 0 und 1 angegeben werden.';
lang.model.infoPositiveNumber='Muss eine positive Zahl sein.';
lang.model.infoNonNegativeNumber='Muss eine nichtnegative Zahl sein.';
lang.model.errorNonNegativeNumberLogNormal='Nur bei der Wahl der <b>Lognormalverteilung</b> oder der <b>Gamma-Verteilung</b> von Bedeutung (muss eine nichtnegative Zahl sein).';
lang.model.distributionDeterministic='Deterministisch';
lang.model.distributionExponential='Exponential verteilt';
lang.model.distributionLogNormal='Lognormal verteilt';
lang.model.distributionGamma='Gamma verteilt';

/* English */

const languageEN={};

lang=languageEN;

lang.multiCore={};
lang.multiCore.two='Two parallel simulation threads';
lang.multiCore.number=' parallel simulation threads';
lang.multiCore.info='Distributes the computing load to all CPU cores. If this option is disabled, only one core is used.';

lang.GUI={};
lang.GUI.imageMode="en";
lang.GUI.Name="G/G/c/K+G Simulator";
lang.GUI.PrivacyTitle="Info";
lang.GUI.PrivacyInfo="All simulations are performed entirely in the browser.<br>This Webapp does not perform any further communication with the server after loading the HTML and script code.";
lang.GUI.OtherLanguage="Eine <a href=\"index_de.html\" onclick=\"localStorage.setItem('selectedLanguage','de')\"><b>deutsche Version</b></a> dieses Simulators steht ebenfalls zur Verfügung.";
lang.GUI.resetSettings='Do you really want to reset all model settings?';
lang.GUI.resetSettingsButton='Example models';
lang.GUI.resetSettingsMD1="<b>M/D/1 Model</b><br><small>(exponential inter-arrival times, constant service times, 1 operator)</small>";
lang.GUI.resetSettingsMM1="<b>M/M/1 Model <span class=\"badge bg-primary\">Default example</span></b><br><small>(exponential inter-arrival and service times, 1 operator)</small>";
lang.GUI.resetSettingsMMc="<b>M/M/5 Model</b><br><small>(exponential inter-arrival times and service times, 5 operators)</small>";
lang.GUI.resetSettingsMGc="<b>M/G/5 Model</b><br><small>(exponential inter-arrival times, log-normal service times, 5 operators)</small>";
lang.GUI.explanationsShow="Show explanations";
lang.GUI.explanationsHide="Hide explanations";
lang.GUI.tabModel='Model';
lang.GUI.tabModelInfo1='The model shown in this simulator is a <b>G/G/c/K+G</b> queuieng model, i.e., clients arrive at the system according to an arbitrary distribution for the inter-arrival times (<b>G</b>). For the service times, an arbitrary probability distribution (<b>G</b>) is also applied. Clients  are served by <b>c</b> operators and the waiting room has a maximum capacity of <b>K</b> clients. Furthermore, <b>batch arrivals</b> and <b>batch service</b> is possible. Also a limited <b>waiting time tolerance</b> (<b>G</b>), <b>retry</b> and <b>forwardings</b> can be modeled. ';
lang.GUI.tabModelInfo2='In the context of analytical queueing theory, the characteristics of a model that fully utilizes the above properties can already no longer be calculated exactly. However, with the help of <a href="https://en.wikipedia.org/wiki/Discrete-event_simulation" target="_blank">event-driven stochastic simulation</a>, such models can easily be investigated. With <a href="#linkMore">more extensive simulation tools</a>, even far more complex models can be simulated in a short time.<br><br>The terms used in the following are defined in the <a href="info.html?glossary" target="_blank">glossary</a>. A brief introduction to the topic of queuing theory and simulation can be found on the <a href="info.html?qt" target="_blank">basic concepts of queueing theory</a> page.';
lang.GUI.tabModelImage='Model_en.svg';
lang.GUI.tabArrivals='Arrivals';
lang.GUI.tabWaitingRoom='Waiting room';
lang.GUI.tabService='Service';
lang.GUI.tabSimulation='Simulation';
lang.GUI.tabSimulationIndicators='Calculate indicators';
lang.GUI.tabSimulationIndicatorsInfo='The more arrivals are simulated, the better fluctuations in the arrival process are balanced out and the more stable the results are - but also the longer the simulation runtimes will be.';
lang.GUI.tabMore='Download';
lang.GUI.tabMoreLong='More simulators';
lang.GUI.tabHelp="Help";
lang.GUI.tabHelpDoc="Queueing theory";
lang.GUI.tabHelpGlossary="Glossary";
lang.GUI.tabHelpTextbook="Textbook<br>\"Simulation mit dem<br>Warteschlangensimulator\"<br>(German)";
lang.GUI.startSimulation='Start simulation';
lang.GUI.cancelSimulation='Cancel simulation';
lang.GUI.recordSimulation='Record simulation';
lang.GUI.recordSimulationInfo='In this mode, only <b>100</b> client arrivals will be simulated. No parameters are recorded, but a log is output for each simulation step. In this way, the course of a simulation or the functioning of the simulator can be traced.';
lang.GUI.output='Output';
lang.GUI.outputClear='Clear output';
lang.GUI.simulators="Simulators";
lang.GUI.simulatorsQueueCalc="Queue calculator";
lang.GUI.closePage="Close page";
lang.GUI.homeURL="queueingsimulation.de";

lang.logging={};
lang.logging.scheduleNext='Scheduling of the next client arrival';
lang.logging.scheduleRetry='Client will start a new call attempt:';
lang.logging.arrival='Arrival of a client, fresh call=';
lang.logging.processStart='Operator available, service process can start immediately.';
lang.logging.processAddToQueue='There is no operator available, client queues up.';
lang.logging.processAddToQueueInfoA1='Client queues up, waiting time tolerance=';
lang.logging.processAddToQueueInfoA2=', number of clients in the queue=';
lang.logging.processAddToQueueInfoB='Client queues up, number of clients in the queue=';
lang.logging.processQueueFull='There is no space in the queue.';
lang.logging.processNoOperatorAndQueueFull='There is no operator available and no place in the queue.';
lang.logging.processWaitingForBatchSize='Operator available, but required service batch size not yet reached.';
lang.logging.processStartService='Start serving a client, service time=';
lang.logging.processStartWaitingInfo='previous waiting time=';
lang.logging.processServiceDone='Serving a client finished, service time was ';
lang.logging.processPostProcessingTime='Post-processing time=';
lang.logging.processForwarding='Client will be forwarded';
lang.logging.processPostProcessingDone='End of post-processing time for a operator';
lang.logging.processStartFromQueue1='There are ';
lang.logging.processStartFromQueue2=' more clients, next service process (';
lang.logging.processStartFromQueue3=' clients) can start directly.';
lang.logging.processQueueMinBatchSize1='There are ';
lang.logging.processQueueMinBatchSize2=' more clients waiting, but this is still too little for an service batch.';
lang.logging.Cancelation='Client leaves the system unattended. Client was in queue=';

lang.statistics={};
lang.statistics.mean='Means';
lang.statistics.variation='Variation';
lang.statistics.range='Range';
lang.statistics.queue='Queue';
lang.statistics.times='Times';
lang.statistics.queueAverage='Average queue length';
lang.statistics.numberOfClientsInSystem='Number of clients in the system';
lang.statistics.numberOfClientsInSystemAverage='Average number of clients in the system';
lang.statistics.numberOfCallers='Number of callers';
lang.statistics.numberOfCallersFreshCalls='Fresh calls';
lang.statistics.numberOfCallersRetryers='Retryer';
lang.statistics.numberOfCallersForwardings='Forwardings';
lang.statistics.numberOfCallersSuccessfulCalls='Successful calls';
lang.statistics.numberOfCallersCanceledCalls='Canceled calls';
lang.statistics.interArrivalTimes='Inter-arrival time';
lang.statistics.interLeaveTimes='Inter-leave time';
lang.statistics.waitingTimesSuccess='Waiting times (successful clients)';
lang.statistics.waitingTimesCancel='Cancelation times';
lang.statistics.waitingTimesAll='Waiting times (for all clients)';
lang.statistics.waitingTimes='Waiting times';
lang.statistics.serviceTimes='Service times';
lang.statistics.postprocessingTimes='Post-processing times';
lang.statistics.residenceTimes='Residence times';
lang.statistics.operators='Operators';
lang.statistics.operatorsAverageBusy='Average number of busy operators';
lang.statistics.workload='Word load';
lang.statistics.simulationSystem='Simulation system';
lang.statistics.simulationSystemSimulatedEvents='Simulated events';
lang.statistics.simulationSystemNeededTime='Needed computing time';
lang.statistics.simulationSystemUsedThreads='Used calculation threads';
lang.statistics.decimalSeparatorInfo='In this output, decimal separators are used according to the selected country setting.';
lang.statistics.compareFormulaExtErlangC="extended Erlang C formula";
lang.statistics.compareFormulaErlangC="Erlang C formula";
lang.statistics.compareFormulaAC="Allen Cunneen approximations formula";
lang.statistics.compareValuesErlangC="Erlang-C comparison values";
lang.statistics.compareValuesAC="Allen Cunneen comparison values";
lang.statistics.compareRelativeDifference="relative difference to simulation";
lang.statistics.compareInfoOk1="The model can be completely described by the ";
lang.statistics.compareInfoOk2=" beschrieben .";
lang.statistics.compareReasonsHeading="The model contains the following properties, which are not taken into account in the formula (and thus are the cause of differences between simulation and formula results):";
lang.statistics.compareReasonsInterArrivalIsNotExp="The inter-arrival times are not exponentially distributed.";
lang.statistics.compareReasonsInterServiceIsNotExp="The service times are not exponentially distributed.";
lang.statistics.compareReasonsWaitingTimeTolerancesNotExp="The waiting time tolerances are not exponentially distributed.";
lang.statistics.compareReasonsArrivalBatch="Clients arrive in groups.";
lang.statistics.compareReasonsServiceBatch="Clients are served in groups.";
lang.statistics.compareReasonsRetry="Retrys exist.";
lang.statistics.compareReasonsForwarding="Forwarding exists.";
lang.statistics.compareReasonsPostProcessing="Post-processing times exist.";

lang.model={};
lang.model.waitingRoomSize='Size of the waiting room';
lang.model.finiteWaitingRoomSize='Limited waiting room size';
lang.model.waitingRoomSizeInfo='If the size of the waiting room is limited and a client arrives while all waiting places are occupied, the client arrival is rejected. This is comparable to a wait cancellation. Clients who are already in service do not occupy waiting room.';
lang.model.waitingRoomSizeInfo2='The waiting room size has to be a non negative integer number.';
lang.model.InterArrivalTimes='Inter-arrival times';
lang.model.InterArrivalTimesInfo='Client arrivals form the basis for every queueing model. Client arrivals are defined by their inter-arrival times, i.e. the intervals between two arrivals that immediately follow each other.';
lang.model.distributionInterArrivalTime='Distribution of the inter-arrival times';
lang.model.averageInterArrivalTime='Average inter-arrival time';
lang.model.stdDevInterArrivalTime='Standard deviation of the inter-arrival times';
lang.model.arrivalBatchSize='Arrival batch size';
lang.model.arrivalBatchSizeInfo='Optionally, multiple clients can arrive per arrival event. In this case, we speak of batch arrivals. If <b>1</b> is selected as the arrival batch size, the clients will arrive individually.';
lang.model.arrivalBatchSizeInfo2='Number of clients per arrival event (has to be a positive integer number).';
lang.model.waitingTimeTolerance='Waiting time tolerance';
lang.model.waitingTimeToleranceInfo='Optionally, clients can have a limited waiting time tolerance. If this is exceeded, they will leave the queue without having been served.';
lang.model.averageWaitingTimeTolerance='Average waiting time tolerance';
lang.model.stdDevWaitingTimeTolerance='Standard deviation of the waiting time tolerances';
lang.model.distributionWaitingTimeTolerance='Distribution of the waiting time tolerances';
lang.model.finiteWaitingTimeTolerance='Clients have limited waiting time tolerance';
lang.model.retryProbability='Retry probability';
lang.model.retryProbabilityInfo='If a client was rejected because there was no more room in the queue when he arrived, or if he gave up waiting prematurely, he can either leave the system permanently unattended or make a new call attempt later. The retry probability indicates the probability with which a client who has left the system unconditionally will make a new call attempt later.';
lang.model.retryProbabilityInfo2='The retry probability has to be a number between 0 and 1.';
lang.model.retryTime='Retry times';
lang.model.retryTimeInfo='If a client has left the system due to queue blocking or because he has abandoned waiting, but has decided to make another call attempt later, he will not call immediately, but only after some time. The retry interval distribution indicates how large this interval turns out to be.';
lang.model.distributionRetryTime='Distribution of the retry times';
lang.model.averageRetryTime='Average retry time';
lang.model.stdDevRetryTime='Standard deviation of the retry times';
lang.model.numberOfOperators='Number of operators';
lang.model.numberOfOperatorsInfo='At the operating desk, the clients are served by the agents. Each agent can serve a maximum of one client or one client batch (if batch operation is used) at the same time. If there are not enough clients in the system, some or all of the agents will be idle. If there are more clients in the system than can be served at the same time, some of the clients will have to wait.';
lang.model.numberOfOperatorsInfo2='The number of operators has to be a positive integer number.';
lang.model.serviceTimes='Service times';
lang.model.serviceTimesInfo='According to the service time distribution, it is determined how long each service process takes.';
lang.model.distributionServiceTime='Distribution of the service times';
lang.model.averageServiceTime='Average service time';
lang.model.stdDevServiceTime='Standard deviation of the service times';
lang.model.serviceBatchSize='Service batch size';
lang.model.serviceBatchSizeInfo='Optionally, multiple clients can be served simultaneously per operation. In this case, we speak of batch service. If <b>1</b> is selected as service batch size, the clients are served individually. If a batch size greater than 1 is selected, an service process is only started when a corresponding number of clients are in the queue (i.e. it may be the case that individual client will have to wait although operators are idle).';
lang.model.serviceBatchSizeInfo2='Number of clients per service process (has to be a positive interger number).';
lang.model.postProcessingTimes='Post-processing times';
lang.model.postProcessingTimesInfo='Optionally, a post-processing time may be required after an operation before the operator reports as available again for serving the next client. During the post-processing time, the client is already no longer in the system (or has been forwarded). However, the operator is still bound by the post-processing.';
lang.model.distributionPostProcessingTime='Distribution of the post-processing times';
lang.model.averagePostProcessingTime='Average post-processing time';
lang.model.stdDevPostProcessingTime='Standard deviation of the post-processing times';
lang.model.servicePolicy='Service policy';
lang.model.servicePolicyInfo='The service policy specifies the principle according to which waiting clients are taken from the queue. If the clients are served in arrival order, i.e. the waiting clients form a classic queue, this is called the <b>FIFO operating mode</b> (first in first out). If the clients are served in reverse order of arrival, this is called the <b>LIFO operation mode</b> (last in first out). LIFO is always used when the clients are workpieces that are stacked and newly arriving workpieces can only be placed on top of the stack and the respective workpiece to be processed next can also only be removed from the top of the stack.';
lang.model.servicePolicyFIFO='FIFO - First in first out';
lang.model.servicePolicyLIFO='LIFO - Last in first out';
lang.model.servicePolicyRandom="Random - Select next customer randomly"
lang.model.forwarding='Forwarding';
lang.model.forwardingProbability='Forwarding probability';
lang.model.forwardingInfo='After a conversation with an agent, it may be necessary for the client to be redirected to the queue again to talk to another agent. The probability with which such a redirection takes place is called the forwarding probability.';
lang.model.forwardingInfo2='The forwarding probability has to be a number between 0 and 1.';
lang.model.numberOfArrivals='Number of arrivals';
lang.model.numberOfArrivalsInfo='Number of arrivals to be simulated (has to be a positive interger number).';
lang.model.warmUpPhase='Additional arrivals for the warm-up phase';
lang.model.warmUpPhaseInfo='Number of additional arrivals for the warm-up phase, which will not be recorded in the statistics (has to be a non negative integer number).';
lang.model.errorNonNegativeNumber='A non-negative number has to be entered.';
lang.model.errorPositiveNumber='A positive number has to be entered.';
lang.model.errorNonNegativeInteger='A non-negative integer number has to be entered.';
lang.model.errorPositiveInteger='A positive integer number has to be entered.';
lang.model.errorProbability='A number between 0 and 1 has to be entered.';
lang.model.infoPositiveNumber='Has to ba a positive number.';
lang.model.infoNonNegativeNumber='Has to ba a non negative number.';
lang.model.errorNonNegativeNumberLogNormal='Only used for the <b>log-normal distribution</b> or the <b>gamma distribution</b> (has to ba a non negative number).';
lang.model.distributionDeterministic='Deterministic';
lang.model.distributionExponential='Exponentially';
lang.model.distributionLogNormal='Log normal';
lang.model.distributionGamma='Gamma normal';

/* Activate language */

const language=(document.documentElement.lang=='de')?languageDE:languageEN;
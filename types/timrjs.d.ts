export = timr;
declare function timr(startTime: any): any;
declare function timr(startTime: any, options: any): any;
declare namespace timr {
  function createStore(...args: any[]): any;
  function formatTime(seconds: any, options: any): any;
  function timeToSeconds(time: any): any;
  function validateStartTime(time: any): any;
}

import {
  useCalls,
  StreamCall,
  useCall,
  CallingState,
  IncomingCall,
  OutgoingCall,
} from "@stream-io/video-react-native-sdk";
import React from "react";

const MyCallUI = () => {
  const calls = useCalls();
  // handle incoming ring calls
  const incomingCalls = calls.filter(
    (call) =>
      call.isCreatedByMe === false &&
      call.state.callingState === CallingState.RINGING
  );
  const [incomingCall] = incomingCalls;
  if (incomingCall) {
    return (
      <StreamCall call={incomingCall!}>
        <IncomingCall />
      </StreamCall>
    );
  }

  const outgoingCalls = calls.filter(
    (call) =>
      call.isCreatedByMe === true &&
      call.state.callingState === CallingState.RINGING
  );

  const [outgoingCall] = outgoingCalls;
  if (outgoingCall) {
    return (
      <StreamCall call={outgoingCall!}>
        <MyCallUI />
      </StreamCall>
    );
  }
  return null;
};

export default MyCallUI;

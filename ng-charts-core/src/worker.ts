self.onmessage = ({ data: { question } }) => {
    console.log(question, 'this is question')
    self.postMessage({
      answer: 42,
    });
};
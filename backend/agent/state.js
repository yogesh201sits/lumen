export class AgentState {
  constructor({
    question = "",
    context = "",
    answer = "",
    followUpQuestions = [],
  } = {}) {
    this.question = question;
    this.context = context;
    this.answer = answer;
    this.followUpQuestions = followUpQuestions;
  }

  isContextEmpty() {
    return !this.context || this.context.length === 0;
  }
}
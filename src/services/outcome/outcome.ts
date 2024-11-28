import { outcome } from './instance'

export function generateOutcome() {
  const response = outcome.chat({
    messages: [
      {
        content: 'Please generate a judgement for the following scenario',
        role: 'system',
      },
    ],
    model: outcome.model,
  })
}

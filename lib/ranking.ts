export function calculateBayesianScore(
  averageRating: number,
  totalVotes: number,
  globalAverage: number,
  minVotes: number
) {
  return (totalVotes / (totalVotes + minVotes)) * averageRating +
         (minVotes / (totalVotes + minVotes)) * globalAverage;
}
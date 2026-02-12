const commentDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
});

export const formatCommentDate = (timestamp: number): string =>
  commentDateFormatter.format(new Date(timestamp));

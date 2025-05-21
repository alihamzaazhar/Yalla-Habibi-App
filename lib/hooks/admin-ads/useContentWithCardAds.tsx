import React from "react";

type Props = {
  content: React.ReactNode[];
  ads: React.ReactNode[];
};

const ContentCoveragePercentage = 50;
const useContentWithCardAds = (props: Props) => {
  const TotalContentLength = props.content.length;
  const showsAfterEvery =
    TotalContentLength > 3
      ? Math.ceil((ContentCoveragePercentage * TotalContentLength) / 100)
      : -1;

  if (showsAfterEvery === -1 || showsAfterEvery === 0) {
    return props.content;
  }
  const groups = [];

  for (let i = 0; i < props.content.length; i++) {
    if (i % showsAfterEvery === 0) {
      groups.push({
        contentElements: props.content.slice(i, i + showsAfterEvery),
      });
    }
  }

  for (let j = 0; j < props.ads.length && j < groups.length; j++) {
    groups[j].contentElements.push(props.ads[j]);
  }
  return groups.map(c => c.contentElements).flat()
};

export default useContentWithCardAds;

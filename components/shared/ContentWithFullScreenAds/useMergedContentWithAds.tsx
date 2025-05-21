import React from "react";

type Props = {
  content: React.ReactNode[];
  ads: React.ReactNode[];
};

const ContentCoveragePercentage = 30;
type ContentElementWithAds = {
  contentElements: React.ReactNode[];
  adElement?: React.ReactNode;
};

const useMergedContentWithAds = (props: Props): ContentElementWithAds[] => {
  const TotalContentLength = props.content.length;
  const showsAfterEvery =
    TotalContentLength > 3
      ? Math.ceil((ContentCoveragePercentage * TotalContentLength) / 100)
      : -1;

  if (showsAfterEvery < 1) {
    return [{ contentElements: props.content }];
  }
  const groups = [] as ContentElementWithAds[];
  
  for (let i=0; i < props.content.length;i++) {
    if (i % showsAfterEvery === 0) {
      groups.push({
        contentElements: props.content.slice(i, i + showsAfterEvery)
      });
    }
  }
  
  for (let j=0; j < props.ads.length && j < groups.length; j++) {
    groups[j].adElement = props.ads[j];
  }

  return groups;
};

export default useMergedContentWithAds;

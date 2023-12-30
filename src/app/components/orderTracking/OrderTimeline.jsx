/* eslint-disable react/prop-types */
import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent, {
  timelineContentClasses,
} from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import moment from "moment";

// eslint-disable-next-line no-unused-vars
export default function OrderTimeline({timeline}) {
  return (
    <Timeline
      sx={{
        [`& .${timelineContentClasses.root}`]: {
          flex: 0.2,
        },
      }}
    >
      {timeline?.timeline?.timeline?.scans?.length > 0 &&
        timeline?.timeline?.timeline?.scans?.map((data, ind) => (
          <TimelineItem key={ind}>
            <TimelineOppositeContent
              color="textSecondary"
              className="min-w-[15%] max-w-[15%] mx-0 px-1 w-fit !text-xs"
            >
              {moment(data?.date).format("DD MMM, hh:mm A")}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="success" />
              {timeline?.timeline?.timeline?.scans?.length != ind+1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent className="w-full min-w-[75%]">
              <>
                <p className="text-xs text-gray-800">
                  <b className="text-black">Activity:</b> { data?.activity}
                  
                </p>
                <p className="text-xs text-gray-800">
                  <b className="text-black">Location:</b>{ data?.location}
                </p>
              </>
            </TimelineContent>
          </TimelineItem>
        ))}
    </Timeline>
  );
}

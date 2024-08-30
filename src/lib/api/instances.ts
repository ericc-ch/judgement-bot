import { ofetch } from "ofetch";

export const janitorKim = ofetch.create({
  baseURL: "https://kim.janitorai.com/",
});

export const janitorAuth = ofetch.create({
  baseURL: "https://auth.janitorai.com/auth/v1/",
  headers: {
    accept: "*/*",
    "accept-language": "en",
    apikey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbXp4dHpvbW1wbnhreW5kZGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwMDcwNzUsImV4cCI6MjAxNDU4MzA3NX0.YFMx-rjr69LVdy0DHSiu3Pr-WxeweQJkVOXabk4F-io",
    authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbXp4dHpvbW1wbnhreW5kZGJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwMDcwNzUsImV4cCI6MjAxNDU4MzA3NX0.YFMx-rjr69LVdy0DHSiu3Pr-WxeweQJkVOXabk4F-io",
    "content-type": "application/json;charset=UTF-8",
    priority: "u=1, i",
    "sec-ch-ua":
      '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "sec-gpc": "1",
    "x-client-info": "supabase-js-web/2.39.6",
  },
  referrerPolicy: "same-origin",
  mode: "cors",
  credentials: "include",
});

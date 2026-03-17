# Plan: Add 5 Power BI Reports for Live Animals Section

## Task Overview
Add 5 new Power BI reports under the "Live Animals & Products" (livestock) section in `app/sections/[slug]/page.tsx`

## Reports Added:
1. **Tax Report** - pageName: `6ec016681553452c19b0`
2. **Export Duty Performance Report** - pageName: `699131e82eeab37bc12c`
3. **Excise Duty Performance Report** - pageName: `5a148b282ab745e0c9be`
4. **Import Declaration Fee Performance Report** - pageName: `1ac94e6b666cc9ee1a3b`
5. **Import Duty Performance Report** - pageName: `14c79f5688b66ee078c2`

Base Power BI URL: `https://app.powerbi.com/view?r=eyJrIjoiNzk2OWU2OTUtODFiYS00ZTY2LWFlNGQtOTE1NTM3MDlhNTdlIiwidCI6Ijk0ZGQwMWM2LWFhMTItNGMzNS1hODEyLWMxMDc5ZGUyOGQ2YSIsImMiOjl9`

## Implementation Completed:
1. ✅ Updated HS_SECTIONS_MAP - Added new Power BI embed URL for livestock section
2. ✅ Added LIVESTOCK_REPORT_PAGES constant for mapping report IDs to page names
3. ✅ Updated getReportsForSection function - Added 7 reports for livestock section (including the 5 new ones plus 2 existing)
4. ✅ Added getPageNameForReport function to map report IDs to Power BI page names
5. ✅ Updated Props interface to include report query parameter
6. ✅ Updated PowerBiEmbed to use currentPageName and currentReportTitle
7. ✅ Updated report links to include report ID parameter

## Status: COMPLETED


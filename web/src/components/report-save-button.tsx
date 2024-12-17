'use client';

import { Button } from '@chakra-ui/react';
import { jsPDF, HTMLWorker } from 'jspdf';
import fetchReportHTML from '../lib/report';

export default function ReportSaveButton(): JSX.Element {
    const generateReport = (html: string): [jsPDF, HTMLWorker] => {
      const report = new jsPDF('portrait', 'mm', 'a4');
      return [report, report.html(html)];
    };

    const getReportName = (): string => {
      const dateInfo = new Date();
      const date = dateInfo.toLocaleDateString().replace(/\//g, '-').replace(/ /g, '_');
      const time = dateInfo.toLocaleTimeString().replace(/:/g, '-').replace(/ /g, '_');
      return `govreport_${date}_${time}.pdf`;
  };

    const generateAndSaveReportPDF = async (): Promise<void> => {
      const html = await fetchReportHTML();
      console.log(html);
      const [report, worker] = generateReport(html);
      await worker;
      report.save(getReportName());
    }
  
    return (
      <Button onClick={generateAndSaveReportPDF}>
        Save Report
      </Button>
    );
}

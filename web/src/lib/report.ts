'use server';

import fs from 'fs';
import { cwd } from 'process';

class Report {
  
  getReportTemplateFilepath(): string {
    return cwd() + '/templates/' + 'report-template.html';
  }

  getReportTemplate(): string {
    let result = '';
    
    result = fs.readFileSync(this.getReportTemplateFilepath(), 'utf-8');
    
    return result
  };

  fillReportTemplate(template: string): string {
    let content = template;

    const date = new Date().toLocaleString();
    content = content.replace(/{{date}}/g, date);

    return content;
  }

}

export default async function fetchReportHTML(): Promise<string> {
  const report = new Report();
  return report.fillReportTemplate(report.getReportTemplate());
}


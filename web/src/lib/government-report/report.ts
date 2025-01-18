'use server';

import fs from 'fs';
import { cwd } from 'process';


function getReportTemplateFilepath(): string {
  return cwd() + '/templates/' + 'report-template.html';
}

function getReportTemplate(): string {
  let result = '';
  
  result = fs.readFileSync(getReportTemplateFilepath(), 'utf-8');
  
  return result
};

function fillReportTemplate(template: string): string {
  let content = template;

  const date = new Date().toLocaleString();
  content = content.replace(/{{date}}/g, date);

  return content;
  }

export default async function fetchReportHTML(): Promise<string> {
  return fillReportTemplate(getReportTemplate());
}


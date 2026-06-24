import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardNavigationProps {
  prevLink?: string;
  prevLabel?: string;
  nextLink?: string;
  nextLabel?: string;
}

export default function WizardNavigation({ prevLink, prevLabel, nextLink, nextLabel }: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
      {prevLink && prevLabel ? (
        <Link href={prevLink} className="flex items-center px-5 py-2.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại: {prevLabel}
        </Link>
      ) : (
        <div /> 
      )}

      {nextLink && nextLabel ? (
        <Link href={nextLink} className="flex items-center px-6 py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 hover:shadow-md transition-all font-semibold">
          Tiếp theo: {nextLabel} <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

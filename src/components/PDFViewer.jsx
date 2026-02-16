'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Fix for DOMMatrix warning in Node.js environment
if (typeof window === 'undefined') {
    global.DOMMatrix = class DOMMatrix {
        constructor() {
            this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
        }
    };
}

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PDFViewer({ fileUrl, highlightedPage = null, className = '' }) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // Jump to highlighted page when prop changes
    useEffect(() => {
        if (highlightedPage && highlightedPage !== pageNumber) {
            setPageNumber(highlightedPage);
        }
    }, [highlightedPage, pageNumber]);

    const goToPrevPage = () => {
        setPageNumber(prev => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(numPages || 1, prev + 1));
    };

    const zoomIn = () => {
        setScale(prev => Math.min(2.0, prev + 0.2));
    };

    const zoomOut = () => {
        setScale(prev => Math.max(0.5, prev - 0.2));
    };

    const toggleFullscreen = () => {
        setIsFullscreen(prev => !prev);
    };

    return (
        <Card className={`flex flex-col h-full bg-white dark:bg-slate-900 border-border shadow-sm ${className}`}>
            {/* Controls */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="h-8 w-8"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[80px] text-center text-foreground">
                        Page {pageNumber} of {numPages || '...'}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={goToNextPage}
                        disabled={pageNumber >= (numPages || 1)}
                        className="h-8 w-8"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={zoomOut}
                        disabled={scale <= 0.5}
                        className="h-8 w-8"
                    >
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[50px] text-center text-foreground">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={zoomIn}
                        disabled={scale >= 2.0}
                        className="h-8 w-8"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleFullscreen}
                        className="h-8 w-8 ml-2"
                    >
                        {isFullscreen ? (
                            <Minimize2 className="h-4 w-4" />
                        ) : (
                            <Maximize2 className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* PDF Display */}
            <div className={`flex-1 overflow-auto p-4 bg-slate-100 dark:bg-slate-950 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
                <div className="flex justify-center">
                    <Document
                        file={fileUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center h-96">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        }
                        error={
                            <div className="flex items-center justify-center h-96 text-destructive">
                                <p>Failed to load PDF. Please try again.</p>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                            className={highlightedPage === pageNumber ? 'ring-2 ring-primary ring-offset-2' : ''}
                        />
                    </Document>
                </div>
            </div>
        </Card>
    );
}

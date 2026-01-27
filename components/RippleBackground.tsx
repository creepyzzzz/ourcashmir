'use client';

import React, { useEffect, useRef } from 'react';

const RippleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const timeRef = useRef(0);
    const gridSizeRef = useRef({ cols: 0, rows: 0 });
    const pointsRef = useRef<any[]>([]);

    // Configuration
    const CONFIG = {
        gridSpacing: 40, // Distance between points
        connectionColor: '#00C853', // Brand Primary
        pointColor: '#00C853',
        waveSpeed: 0.02,
        waveAmplitude: 20,
        mouseRadius: 250,
        mouseStrength: 50,
        friction: 0.9,
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const initPoints = () => {
            const dpr = window.devicePixelRatio || 1;
            // Use logical dimensions based on canvas.width (which creates the buffer)
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            const cols = Math.ceil(width / CONFIG.gridSpacing) + 2;
            const rows = Math.ceil(height / CONFIG.gridSpacing) + 2;

            gridSizeRef.current = { cols, rows };

            const newPoints = [];
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const originX = (x * CONFIG.gridSpacing) - CONFIG.gridSpacing;
                    const originY = (y * CONFIG.gridSpacing) - CONFIG.gridSpacing;
                    newPoints.push({
                        x: originX,
                        y: originY,
                        originX,
                        originY,
                        vx: 0,
                        vy: 0
                    });
                }
            }
            pointsRef.current = newPoints;
        };

        const handleResize = () => {
            if (canvas.parentElement) {
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.parentElement.getBoundingClientRect();

                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;

                // Reset scale to default then apply dpr
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);

                initPoints();
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        // Initial resize
        handleResize();

        const render = () => {
            timeRef.current += CONFIG.waveSpeed;

            const dpr = window.devicePixelRatio || 1;
            // Use canvas.width/dpr for clearing to be safe
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            ctx.clearRect(0, 0, width, height);

            // If points are empty, try to init (fallback)
            if (pointsRef.current.length === 0) {
                initPoints();
            }

            const points = pointsRef.current;
            const { cols, rows } = gridSizeRef.current;
            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;

            if (points.length === 0) {
                // If still empty, skip this frame
                animationFrameId = requestAnimationFrame(render);
                return;
            }

            // Update Points
            for (let i = 0; i < points.length; i++) {
                const p = points[i];

                // 1. Natural Wave Motion (Sinusoidal)
                const waveX = Math.sin(p.originY * 0.05 + timeRef.current) * Math.cos(p.originX * 0.05 + timeRef.current) * 5;
                const waveY = Math.sin(p.originX * 0.05 + timeRef.current) * Math.sin(p.originY * 0.05 + timeRef.current) * 5;

                // 2. Mouse Interaction
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let forceX = 0;
                let forceY = 0;

                if (dist < CONFIG.mouseRadius) {
                    const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    // Push away
                    const push = -force * CONFIG.mouseStrength;

                    forceX = Math.cos(angle) * push;
                    forceY = Math.sin(angle) * push;
                }

                // Apply forces to velocity
                p.vx += forceX * 0.05;
                p.vy += forceY * 0.05;

                // Return to origin (elasticity) with wave offset
                const targetX = p.originX + waveX;
                const targetY = p.originY + waveY;

                p.vx += (targetX - p.x) * 0.1;
                p.vy += (targetY - p.y) * 0.1;

                // Friction
                p.vx *= CONFIG.friction;
                p.vy *= CONFIG.friction;

                // Update position
                p.x += p.vx;
                p.y += p.vy;
            }

            // Draw Grid Lines (Cloth effect)
            ctx.strokeStyle = CONFIG.connectionColor;
            ctx.lineWidth = 1; // Thicker lines for visibility
            ctx.globalAlpha = 0.4; // More opaque for visibility

            // Draw Horizontal Lines
            ctx.beginPath();
            for (let y = 0; y < rows; y++) {
                const rowStartIdx = y * cols;
                if (points[rowStartIdx]) {
                    ctx.moveTo(points[rowStartIdx].x, points[rowStartIdx].y);
                    for (let x = 1; x < cols; x++) {
                        const p = points[rowStartIdx + x];
                        if (p) ctx.lineTo(p.x, p.y);
                    }
                }
            }
            ctx.stroke();

            // Draw Vertical Lines
            ctx.beginPath();
            for (let x = 0; x < cols; x++) {
                const colStartIdx = x;
                if (points[colStartIdx]) {
                    ctx.moveTo(points[colStartIdx].x, points[colStartIdx].y);
                    for (let y = 1; y < rows; y++) {
                        const p = points[y * cols + x];
                        if (p) ctx.lineTo(p.x, p.y);
                    }
                }
            }
            ctx.stroke();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none"
        />
    );
};

export default RippleBackground;

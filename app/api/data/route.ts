import { NextRequest, NextResponse } from 'next/server';
import { generateInitialDataset, generateNewDataPoint } from '@/lib/dataGenerator';
import { DataPoint } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const count = parseInt(searchParams.get('count') || '1000', 10);
  const type = searchParams.get('type') || 'initial';

  try {
    let data: DataPoint[];

    if (type === 'initial') {
      data = generateInitialDataset(Math.min(count, 10000));
    } else if (type === 'single') {
      data = [generateNewDataPoint()];
    } else {
      data = generateInitialDataset(Math.min(count, 10000));
    }

    return NextResponse.json({ data, count: data.length });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'generate') {
      const count = body.count || 1;
      const data: DataPoint[] = [];
      for (let i = 0; i < count; i++) {
        data.push(generateNewDataPoint());
      }
      return NextResponse.json({ data, count: data.length });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import { products } from '../../../lib/data/products';

// This is an API Route Skeleton.
// A Backend Engineer can replace the 'products' mock import 
// with an actual database query (e.g., Prisma, Mongoose, raw SQL)
export async function GET() {
    try {
        // Example DB query: const dbProducts = await prisma.product.findMany();

        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

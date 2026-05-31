import dbConnect from '@/lib/mongodb'
import User from '@/models/users'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    await dbConnect()
    const { username, email, password } = await req.json()
    const newUser = new User({
      username,
      email,
      passwordHash: password,
    })
    await newUser.save()
    return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 })
  }
}
/*
import dbConnect from '@/lib/mongodb'
import User from '@/models/users'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 1. Intentar conectar
    await dbConnect()
    
    // 2. Crear un usuario de prueba rápido
    // (Solo para verificar que la base de datos escribe)
    const testUser = {
      username: "testuser_" + Math.floor(Math.random() * 1000),
      email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      passwordHash: "123456"
    }

    const newUser = new User(testUser)
    await newUser.save()

    return NextResponse.json({ 
      message: '¡Conexión exitosa y usuario creado!', 
      user: testUser 
    }, { status: 201 })

  } catch (error: any) {
    console.error("Error detallado:", error) // Esto imprimirá el error real en tu terminal
    return NextResponse.json({ 
      message: 'Error en el servidor', 
      error: error.message 
    }, { status: 500 })
  }
}
*/
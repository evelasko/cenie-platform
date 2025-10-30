#!/usr/bin/env node

/**
 * Grant Editorial App Access to a User
 *
 * Usage:
 *   node scripts/grant-editorial-access.js YOUR_USER_ID
 *
 * Or interactively:
 *   node scripts/grant-editorial-access.js
 */

const admin = require('firebase-admin')
const path = require('path')

// Initialize Firebase Admin
const serviceAccountPath = path.resolve(__dirname, '../firebase-serviceaccount.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  projectId: 'cenie-platform',
})

const db = admin.firestore()

async function grantAccess(userId, role = 'admin') {
  try {
    console.log(`\n🔑 Granting ${role} access to Editorial app for user: ${userId}\n`)

    // Check if user exists in Firebase Auth
    const userRecord = await admin.auth().getUser(userId)
    console.log('✅ User found in Firebase Auth:')
    console.log('   Email:', userRecord.email)
    console.log('   Display Name:', userRecord.displayName || '(not set)')

    // Check if access already exists
    const existingAccess = await db
      .collection('user_app_access')
      .where('userId', '==', userId)
      .where('appName', '==', 'editorial')
      .limit(1)
      .get()

    if (!existingAccess.empty) {
      const doc = existingAccess.docs[0]
      const data = doc.data()
      console.log('\n⚠️  User already has access:')
      console.log('   Role:', data.role)
      console.log('   Active:', data.isActive)

      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      return new Promise((resolve) => {
        readline.question('\nUpdate existing access? (y/n): ', async (answer) => {
          readline.close()
          if (answer.toLowerCase() === 'y') {
            await doc.ref.update({
              role,
              isActive: true,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            })
            console.log('\n✅ Access updated successfully!')
          } else {
            console.log('\n❌ Cancelled')
          }
          resolve()
        })
      })
    }

    // Create new access record
    const accessData = {
      userId,
      appName: 'editorial',
      role,
      isActive: true,
      grantedAt: admin.firestore.FieldValue.serverTimestamp(),
      grantedBy: 'script',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    await db.collection('user_app_access').add(accessData)

    console.log('\n✅ Access granted successfully!')
    console.log('\n📝 Created access record:')
    console.log('   App:', 'editorial')
    console.log('   Role:', role)
    console.log('   Active:', true)
    console.log('\n🚀 You can now sign in to the Editorial app!')
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error('\n❌ Error: User not found in Firebase Auth')
      console.error('   Make sure you sign in at least once to create the user account')
    } else {
      console.error('\n❌ Error granting access:', error.message)
      console.error(error)
    }
    process.exit(1)
  }
}

// Main
async function main() {
  let userId = process.argv[2]
  let role = process.argv[3] || 'admin'

  if (!userId) {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    console.log('\n🔐 Grant Editorial App Access\n')
    console.log('Enter user details:\n')

    userId = await new Promise((resolve) => {
      readline.question('User ID: ', (answer) => resolve(answer))
    })

    role = await new Promise((resolve) => {
      readline.question('Role (admin/editor) [admin]: ', (answer) => {
        resolve(answer || 'admin')
      })
    })

    readline.close()
  }

  if (!userId || userId.trim() === '') {
    console.error('❌ Error: User ID is required')
    console.error('\nUsage: node scripts/grant-editorial-access.js USER_ID [ROLE]')
    console.error('Example: node scripts/grant-editorial-access.js abc123xyz admin')
    process.exit(1)
  }

  await grantAccess(userId.trim(), role)
  process.exit(0)
}

main()

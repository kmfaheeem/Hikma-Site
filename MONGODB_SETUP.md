# MongoDB Setup Guide for Union Site

This guide will help you set up MongoDB to replace Firebase Storage for file storage using GridFS.

## Why MongoDB GridFS?

MongoDB GridFS is used to store files larger than 16MB or when you need to store metadata with files. It's perfect for image storage in the Union Site project.

## Prerequisites

- MongoDB account (MongoDB Atlas recommended for cloud hosting)
- MongoDB connection string

## Step 1: Create MongoDB Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Create a new cluster (free tier M0 is sufficient)
4. Choose a cloud provider and region closest to you

## Step 2: Get Connection String

1. In MongoDB Atlas, click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and copy the connection string
4. It should look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## Step 3: Create Database User

1. In MongoDB Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Set username and password (save these!)
5. Set privileges to "Read and write to any database"

## Step 4: Configure Network Access

1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add only your server IP addresses

## Step 5: Update Environment Variables

Add to your `.env.local` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=union-site
```

Replace:
- `<username>` with your database username
- `<password>` with your database password
- `cluster0.xxxxx.mongodb.net` with your cluster URL

**Important**: Make sure to URL-encode your password if it contains special characters!

## Step 6: Install Dependencies

The MongoDB package should already be in package.json. If not, run:

```bash
npm install mongodb
```

## Step 7: Test the Connection

1. Start your development server: `npm run dev`
2. Try uploading an image through the Gallery page (as admin)
3. Check MongoDB Atlas > Browse Collections to see the `files` collection

## MongoDB Collections Structure

### GridFS Collections (Automatic)

When you upload files, MongoDB GridFS automatically creates:
- `files.files` - File metadata
- `files.chunks` - File data chunks

### Firestore Collections (Still Used)

- `users/` - User profiles with roles
- `blogPosts/` - Blog posts (with MongoDB file references)
- `notifications/` - User notifications
- `events/` - Event listings (with MongoDB file references)
- `gallery/` - Gallery images metadata (with MongoDB file references)

## File Storage Paths

Files are stored in GridFS with the following folder structure:
- `gallery/` - Gallery images
- `blog/` - Blog post images
- `events/` - Event images
- `general/` - Other files

## API Routes

### Upload File
- **POST** `/api/upload`
  - Body: FormData with `file` and `folder`
  - Returns: `{ fileId, fileUrl, filename, contentType }`

### Get File
- **GET** `/api/files/[id]`
  - Returns: File content with appropriate headers

### Delete File
- **DELETE** `/api/files/[id]`
  - Deletes file from GridFS

## Migration from Firebase Storage

If you have existing files in Firebase Storage:

1. Download all files from Firebase Storage
2. Upload them through the new MongoDB system
3. Update Firestore documents to reference new MongoDB file URLs

## Troubleshooting

### Connection Issues

**Error: "MongoNetworkError"**
- Check network access in MongoDB Atlas
- Verify connection string is correct
- Ensure IP address is whitelisted

**Error: "Authentication failed"**
- Verify username and password in connection string
- Check database user has read/write permissions
- URL-encode special characters in password

### File Upload Issues

**Error: "Failed to upload file"**
- Check MongoDB connection
- Verify GridFS bucket is accessible
- Check file size limits (default: 16MB per chunk)

### File Retrieval Issues

**404 Error when accessing files**
- Verify file ID exists in GridFS
- Check file was uploaded successfully
- Ensure API route is accessible

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. Use environment-specific connection strings
3. Restrict network access to specific IPs in production
4. Use strong database passwords
5. Regularly rotate database credentials

## Production Considerations

1. Use MongoDB Atlas paid tier for production (better performance)
2. Set up connection pooling for high traffic
3. Implement file size limits
4. Add file type validation
5. Set up regular backups
6. Monitor database usage and costs

## Backup Strategy

MongoDB Atlas provides automatic backups on paid tiers. For free tier:
- Export collections periodically
- Download GridFS files
- Store backups in separate location

## Cost Estimation

- **Free Tier (M0)**: 512MB storage, suitable for development
- **M10 Tier**: ~$57/month, 10GB storage, production-ready
- **Storage**: Additional storage available, pay-as-you-go

## Additional Resources

- [MongoDB GridFS Documentation](https://docs.mongodb.com/manual/core/gridfs/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## Support

For MongoDB-specific issues:
- MongoDB Atlas Support (if on paid tier)
- MongoDB Community Forums
- MongoDB Documentation

For application-specific issues:
- Check application logs
- Verify API routes are working
- Test file upload/download endpoints


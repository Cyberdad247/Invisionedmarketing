import { put, list, del } from "@vercel/blob"

// Upload a file to the blob store
export async function uploadFile(file: File, agentId: string) {
  try {
    const filename = `agent-${agentId}-${file.name}`
    const blob = await put(filename, file, {
      access: "public",
    })

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
      size: blob.size,
    }
  } catch (error) {
    console.error("File upload error:", error)
    throw error
  }
}

// List all files for an agent
export async function listAgentFiles(agentId: string) {
  try {
    const { blobs } = await list({
      prefix: `agent-${agentId}`,
    })

    return blobs
  } catch (error) {
    console.error("File listing error:", error)
    throw error
  }
}

// Delete a file from the blob store
export async function deleteFile(url: string) {
  try {
    await del(url)
    return { success: true }
  } catch (error) {
    console.error("File deletion error:", error)
    throw error
  }
}

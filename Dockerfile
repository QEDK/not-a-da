# write a Dockerfile that uses bun to run the node.ts file
FROM bun:latest

# Copy the node.ts file into the container
COPY node.ts /app/node.ts

# Run the node.ts file
CMD ["bun", "node.ts"]

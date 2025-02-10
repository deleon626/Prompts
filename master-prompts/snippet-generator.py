import sys
import os
import json

def format_snippet_body(input_text):
    """Convert input text into a list of lines for a VS Code snippet body."""
    # Split the text into lines and remove empty lines
    lines = [line.rstrip() for line in input_text.split('\n') if line.strip()]
    return lines

def main():
    """Main function to process command-line argument, generate and output snippet JSON to file."""
    if len(sys.argv) < 2:
        print("Usage: python snippet_generator.py <input_file>")
        return

    input_file = sys.argv[1]
    abs_input_file = os.path.abspath(input_file)

    if not os.path.exists(abs_input_file):
        print(f"Error: Input file '{abs_input_file}' not found!")
        return

    try:
        # Read the input file
        with open(abs_input_file, 'r') as f:
            input_text = f.read()

        # Generate the snippet body as a list of lines
        snippet_body = format_snippet_body(input_text)

        # Create a complete snippet JSON structure
        snippet = {
            "Your Snippet Name": {
                "scope": "javascript,typescript",
                "prefix": "yourprefix",
                "body": snippet_body,
                "description": "Your snippet description"
            }
        }

        # Define output file name (e.g., input_file_snippet.json)
        output_file = os.path.splitext(abs_input_file)[0] + '_snippet.json'

        # Write the snippet JSON structure to the output file
        with open(output_file, 'w') as f:
            json.dump(snippet, f, indent=4)

        print(f"\nSnippet has been generated and saved to: {output_file}")

    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
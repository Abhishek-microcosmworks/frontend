export async function extractSectionNames(blogsSection) {

    const sectionNames = [];
    try { 

        const sectionRegex = /Section (\d+): ([^\n]+)/g;
        let match;
        while ((match = sectionRegex.exec(blogsSection)) !== null) {
            const sectionTitle = match[2];
            sectionNames.push(sectionTitle.trim());
        }
      return { error: false, data: sectionNames };
    } catch (error) {
      console.log(error);
      return { error: true, message: 'Error while extracting section names.' };
    }
  }
  
import * as functions from '../src/functions'

test('parse valid title', async() => {
    let title = "[porter/hello-world] An issue";
    let parsed = functions.parseIssueTitle(title);

    expect(parsed.bundleDir).toBe("porter/hello-world");
    expect(parsed.issueSummary).toBe("An issue");
});
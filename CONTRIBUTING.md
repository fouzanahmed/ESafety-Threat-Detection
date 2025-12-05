# Contributing to ESafety Threat Detection

Thank you for considering contributing to ESafety Threat Detection! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Maintain a harassment-free environment

## How to Contribute

### Reporting Bugs

1. Check if the bug is already reported in Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check existing feature requests
2. Create an issue describing:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative solutions considered
   - Additional context

### Code Contributions

#### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/ESafety-Threat-Detection.git
   cd ESafety-Threat-Detection
   ```

3. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Install dependencies:
   ```bash
   npm run install-all
   ```

5. Make your changes

#### Code Style

- Use 2 spaces for indentation
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code patterns
- Run linting before committing

#### Testing

- Write tests for new features
- Ensure existing tests pass
- Test manually in browser

```bash
npm test
```

#### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add batch analysis endpoint
fix: Resolve image upload error
docs: Update setup instructions
refactor: Improve AI service error handling
```

#### Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Create pull request with:
   - Clear description of changes
   - Link to related issues
   - Screenshots if UI changes

### Documentation

Help improve our documentation:
- Fix typos and errors
- Add examples
- Clarify confusing sections
- Translate to other languages

## Development Guidelines

### Backend Development

- Keep routes thin, logic in controllers/services
- Use async/await for asynchronous code
- Handle errors properly with try/catch
- Log important events and errors
- Validate input data
- Follow REST API conventions

### Frontend Development

- Use functional components with hooks
- Keep components small and focused
- Use Material-UI components consistently
- Handle loading and error states
- Make UI responsive
- Optimize performance

### AI/ML Integration

- Support multiple AI providers
- Implement fallback mechanisms
- Cache responses when appropriate
- Monitor API usage and costs
- Handle rate limits gracefully

## Project Priorities

### Current Focus

1. Improving accuracy of threat detection
2. Adding support for more content types
3. Enhancing user experience
4. Optimizing performance
5. Expanding documentation

### Future Goals

- Multi-language support
- Mobile applications
- Browser extension
- API for developers
- Custom ML models

## Community

### Getting Help

- Read documentation first
- Search existing issues
- Ask questions in Discussions
- Be patient and respectful

### Helping Others

- Answer questions in Discussions
- Review pull requests
- Improve documentation
- Share your experience

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to reach out by creating an issue or discussion thread.

Thank you for contributing to make the internet safer!

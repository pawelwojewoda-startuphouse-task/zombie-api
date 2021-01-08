jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockImplementation(() => ({ listen: jest.fn() })),
  },
}));
jest.mock('./app.module', () => ({ AppModule: jest.fn() }));

/*
 * PLEASE NOTE:
 *
 * This test file is just a *simple placeholder*.
 * It is a similar concern to testing module files.
 * For more information, see section "Testing @Module-decorated classes"
 * under the file tests/unit/README.md.
 *
 */

describe('bootstrap', () => {
  describe('Initialization', () => {
    it('should successfully bootstrap', async () => {
      // Arrange (Given)
      require('./main');

      // Act (When)
      // -

      // Assert (Then)
      // -
    });
  });
});

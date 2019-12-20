import { Swal } from '../utils'

describe('API', () => {
  it('properties of `Swal` class are consistent', (done) => {
    const assertConsistent = postfix => {
      const currentSwalPropNames = Object.keys(Swal)
      // const extraPropNames = currentSwalPropNames.filter(key => !initialSwalPropNames.includes(key))
      // expect(extraPropNames.length, 0).to.be.eql(`# of extra properties ${postfix}`)
      // expect(extraPropNames.join(','), '').to.be.eql(`extra property names ${postfix}`)
      const missingProps = currentSwalPropNames.filter(key => !currentSwalPropNames.includes(key))
      assert.deepEqual(missingProps.length, 0, `# of missing properties ${postfix}`)
      assert.deepEqual(missingProps.join(','), '', `missing property names ${postfix}`)
    }
    assertConsistent('before first swal')
    Swal.fire({
      title: 'test',
      onOpen: () => {
        assertConsistent('after opening first swal')
        Swal.clickConfirm()
      }
    }).then(() => {
      assertConsistent('after closing first swal')
      done()
    })
  })

  it('ways to instantiate', () => {
    expect((new Swal('foo')) instanceof Swal).to.be.true
    expect(Swal.fire('foo') instanceof Swal).to.be.true
  })

  it('instance properties and methods', () => {
    const params = { input: 'text', inputValue: 'foo' }
    const swal = Swal.fire(params)
    expect(Object.keys(swal)).to.be.eql(['params'])
    expect(swal.params).to.be.eql(params)
    expect(swal.getInput().value).to.equal('foo')
  })

  it('extending swal', (done) => {
    const MySwal = class extends Swal {
      static argsToParams (args) {
        expect(args).to.be.eql(['arg'])
        return { title: 'title' }
      }

      _main (params) {
        expect(params).to.be.eql({ title: 'title' })
        return super._main({
          input: 'text',
          inputValue: 'inputValue',
          onOpen: () => MySwal.clickConfirm()
        }).then(result => {
          expect(result).to.be.eql({ value: 'inputValue' })
          return 'result'
        })
      }
    }
    MySwal.fire('arg').then(result => {
      expect(result).to.equal('result')
      done()
    })
  })
})
